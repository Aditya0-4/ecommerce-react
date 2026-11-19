
import pandas as pd
import numpy as np
import joblib

from pathlib import Path
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask import Blueprint, jsonify, request


# -----------------------------------
# 1. Create Blueprint
# -----------------------------------

forecast_bp = Blueprint("forecast", __name__)

BASE_DIR = Path(__file__).resolve().parent


# -----------------------------------
# 2. Load trained models
# -----------------------------------

revenue_model = joblib.load(
    BASE_DIR / "sales_revenue_model.pkl"
)

units_model = joblib.load(
    BASE_DIR / "sales_units_model.pkl"
)

model_features = joblib.load(
    BASE_DIR / "model_features.pkl"
)


# -----------------------------------
# 3. Load historical sales
# -----------------------------------

def load_sales_data():

    df = pd.read_csv(BASE_DIR / "daily_sales.csv")

    df["date"] = pd.to_datetime(df["date"])

    df = df.sort_values("date").reset_index(drop=True)

    return df


# -----------------------------------
# 4. Forecast generation
# -----------------------------------

def generate_forecast(days):

    df = load_sales_data()

    revenue_history = (
        df["dailyRevenue"].astype(float).tolist()
    )

    units_history = (
        df["dailyUnits"].astype(float).tolist()
    )

    last_date = df["date"].iloc[-1]

    if len(revenue_history) < 14:
        raise ValueError("At least 14 days of sales history required.")

    predictions = []

    for i in range(1, days + 1):

        future_date = last_date + timedelta(days=i)

        # Date features
        day = future_date.day
        month = future_date.month
        dayOfWeek = future_date.dayofweek

        isWeekend = int(dayOfWeek >= 5)

        # Revenue features
        revenue_lag_1 = revenue_history[-1]
        revenue_lag_7 = revenue_history[-7]

        revenue_rolling_7 = np.mean(
            revenue_history[-7:]
        )

        revenue_rolling_14 = np.mean(
            revenue_history[-14:]
        )

        # Units features
        units_lag_1 = units_history[-1]
        units_lag_7 = units_history[-7]

        units_rolling_7 = np.mean(
            units_history[-7:]
        )

        units_rolling_14 = np.mean(
            units_history[-14:]
        )

        # Common feature values
        feature_values = {
            "day": day,
            "month": month,
            "dayOfWeek": dayOfWeek,
            "isWeekend": isWeekend,

            "revenue_lag_1": revenue_lag_1,
            "revenue_lag_7": revenue_lag_7,
            "revenue_rolling_7": revenue_rolling_7,
            "revenue_rolling_14": revenue_rolling_14,

            "units_lag_1": units_lag_1,
            "units_lag_7": units_lag_7,
            "units_rolling_7": units_rolling_7,
            "units_rolling_14": units_rolling_14
        }

        # Prepare revenue input
        revenue_input = pd.DataFrame(
            [[feature_values[f] for f in model_features["revenue"]]],
            columns=model_features["revenue"]
        )

        # Prepare units input
        units_input = pd.DataFrame(
            [[feature_values[f] for f in model_features["units"]]],
            columns=model_features["units"]
        )

        # Predict revenue
        predicted_revenue = revenue_model.predict(
            revenue_input
        )[0]

        # Predict units
        predicted_units = units_model.predict(
            units_input
        )[0]

        # Prevent negative predictions
        predicted_revenue = max(0, predicted_revenue)
        predicted_units = max(0, predicted_units)

        predicted_revenue = round(float(predicted_revenue), 2)
        predicted_units = int(round(predicted_units))

        # Store predictions
        predictions.append({
            "date": future_date.strftime("%Y-%m-%d"),
            "predictedRevenue": predicted_revenue,
            "predictedUnits": predicted_units
        })

        # Add predictions to history
        revenue_history.append(predicted_revenue)
        units_history.append(predicted_units)

    return predictions


# -----------------------------------
# 5. Forecast API
# -----------------------------------

@forecast_bp.route("/api/forecast", methods=["GET"])
@jwt_required()
def forecast():

    try:

        days = int(request.args.get("days", 30))

        if days not in [7, 15, 30]:
            return jsonify({
                "success": False,
                "message": "Days must be 7, 15 or 30"
            }), 400

        predictions = generate_forecast(days)

        total_revenue = sum(
            item["predictedRevenue"]
            for item in predictions
        )

        total_units = sum(
            item["predictedUnits"]
            for item in predictions
        )

        return jsonify({
            "success": True,
            "forecastDays": days,
            "totalPredictedRevenue": round(total_revenue, 2),
            "totalPredictedUnits": total_units,
            "averageDailyRevenue": round(
                total_revenue / days, 2
            ),
            "predictions": predictions
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# -----------------------------------
# 6. Historical sales API
# -----------------------------------

@forecast_bp.route(
    "/api/forecast/history",
    methods=["GET"]
)
def forecast_history():

    try:

        df = load_sales_data()

        records = []

        for _, row in df.tail(30).iterrows():

            records.append({
                "date": row["date"].strftime("%Y-%m-%d"),
                "revenue": int(row["dailyRevenue"]),
                "units": int(row["dailyUnits"]),
                "orders": int(row["orderCount"])
            })

        return jsonify({
            "success": True,
            "history": records
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
