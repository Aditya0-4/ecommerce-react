
import pandas as pd
import numpy as np
import joblib

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# -----------------------------------
# 1. Load data
# -----------------------------------

df = pd.read_csv("daily_sales.csv")

df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

df["date"] = pd.to_datetime(df["date"])

df = df.sort_values("date").reset_index(drop=True)


# -----------------------------------
# 2. Date features
# -----------------------------------

df["day"] = df["date"].dt.day
df["month"] = df["date"].dt.month
df["dayOfWeek"] = df["date"].dt.dayofweek
df["isWeekend"] = (df["dayOfWeek"] >= 5).astype(int)


# -----------------------------------
# 3. Revenue features
# -----------------------------------

df["revenue_lag_1"] = df["dailyRevenue"].shift(1)
df["revenue_lag_7"] = df["dailyRevenue"].shift(7)

df["revenue_rolling_7"] = (
    df["dailyRevenue"].shift(1).rolling(7).mean()
)

df["revenue_rolling_14"] = (
    df["dailyRevenue"].shift(1).rolling(14).mean()
)


# -----------------------------------
# 4. Units features
# -----------------------------------

df["units_lag_1"] = df["dailyUnits"].shift(1)
df["units_lag_7"] = df["dailyUnits"].shift(7)

df["units_rolling_7"] = (
    df["dailyUnits"].shift(1).rolling(7).mean()
)

df["units_rolling_14"] = (
    df["dailyUnits"].shift(1).rolling(14).mean()
)


# -----------------------------------
# 5. Remove missing rows
# -----------------------------------

df = df.dropna().reset_index(drop=True)

df.to_csv("processed_sales.csv", index=False)


# -----------------------------------
# 6. Define separate feature sets
# -----------------------------------

revenue_features = [
    "day",
    "month",
    "dayOfWeek",
    "isWeekend",
    "revenue_lag_1",
    "revenue_lag_7",
    "revenue_rolling_7",
    "revenue_rolling_14",
    "units_lag_1",
    "units_lag_7",
    "units_rolling_7",
    "units_rolling_14"
]

units_features = [
    "day",
    "month",
    "dayOfWeek",
    "isWeekend",
    "units_lag_1",
    "units_lag_7",
    "units_rolling_7",
    "units_rolling_14",
    "revenue_lag_1",
    "revenue_lag_7",
    "revenue_rolling_7",
    "revenue_rolling_14"
]


# -----------------------------------
# 7. Train and compare models
# -----------------------------------

def train_target(target, features):

    X = df[features]
    y = df[target]

    # Chronological 80/20 split
    split_index = int(len(df) * 0.8)

    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]

    y_train = y.iloc[:split_index]
    y_test = y.iloc[split_index:]

    models = {
        "Linear Regression": LinearRegression(),

        "Random Forest": RandomForestRegressor(
            n_estimators=300,
            max_depth=4,
            min_samples_leaf=3,
            random_state=42
        )
    }

    results = {}

    print(f"\n========== {target} ==========")

    for name, model in models.items():

        model.fit(X_train, y_train)

        predictions = model.predict(X_test)

        mae = mean_absolute_error(y_test, predictions)

        rmse = np.sqrt(
            mean_squared_error(y_test, predictions)
        )

        r2 = r2_score(y_test, predictions)

        results[name] = {
            "model": model,
            "MAE": mae,
            "RMSE": rmse,
            "R2": r2
        }

        print(f"\n{name}")
        print("MAE:", round(mae, 2))
        print("RMSE:", round(rmse, 2))
        print("R2:", round(r2, 4))

    # Select model with lowest MAE
    best_name = min(
        results,
        key=lambda name: results[name]["MAE"]
    )

    best_model = results[best_name]["model"]

    print("\nSelected model:", best_name)

    return best_model, features


# -----------------------------------
# 8. Train both targets
# -----------------------------------

revenue_model, revenue_feature_list = train_target(
    "dailyRevenue",
    revenue_features
)

units_model, units_feature_list = train_target(
    "dailyUnits",
    units_features
)


# -----------------------------------
# 9. Save models and features
# -----------------------------------

joblib.dump(
    revenue_model,
    "sales_revenue_model.pkl"
)

joblib.dump(
    units_model,
    "sales_units_model.pkl"
)

joblib.dump(
    {
        "revenue": revenue_feature_list,
        "units": units_feature_list
    },
    "model_features.pkl"
)

print("\nBoth models saved successfully!")
