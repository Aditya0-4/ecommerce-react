
import pandas as pd
import numpy as np
import joblib

from datetime import timedelta
import matplotlib.pyplot as plt


# -----------------------------------
# 1. Load trained model and data
# -----------------------------------

model = joblib.load("sales_model.pkl")
features = joblib.load("model_features.pkl")

df = pd.read_csv("daily_sales.csv")

df["date"] = pd.to_datetime(df["date"])

df = df.sort_values("date").reset_index(drop=True)

# Keep historical revenue
revenue_history = df["dailyRevenue"].astype(float).tolist()

# Get last recorded date
last_date = df["date"].iloc[-1]

if len(revenue_history) < 14:
    raise ValueError("At least 14 days of sales history are required.")

# -----------------------------------
# 2. Get forecasting period
# -----------------------------------

days = int(input("Enter forecast days (7, 15 or 30): "))

if days not in [7, 15, 30]:
    raise ValueError("Please enter 7, 15 or 30.")

# -----------------------------------
# 3. Generate future predictions
# -----------------------------------

future_predictions = []

for i in range(1, days + 1):

    # Calculate future date
    future_date = last_date + timedelta(days=i)

    # Date-based features
    day = future_date.day
    month = future_date.month
    dayOfWeek = future_date.dayofweek

    isWeekend = int(dayOfWeek >= 5)

    # Historical revenue features
    revenue_lag_1 = revenue_history[-1]

    revenue_lag_7 = revenue_history[-7]

    revenue_rolling_7 = np.mean(
        revenue_history[-7:]
    )

    revenue_rolling_14 = np.mean(
        revenue_history[-14:]
    )

    # Prepare model input
    input_data = pd.DataFrame([{
        "day": day,
        "month": month,
        "dayOfWeek": dayOfWeek,
        "isWeekend": isWeekend,
        "revenue_lag_1": revenue_lag_1,
        "revenue_lag_7": revenue_lag_7,
        "revenue_rolling_7": revenue_rolling_7,
        "revenue_rolling_14": revenue_rolling_14
    }])[features]

    # Predict revenue
    predicted_revenue = model.predict(input_data)[0]

    # Revenue cannot be negative
    predicted_revenue = max(0, predicted_revenue)

    predicted_revenue = round(predicted_revenue, 2)

    # Store prediction
    future_predictions.append({
        "date": future_date,
        "predictedRevenue": predicted_revenue
    })

    # Add prediction to history
    # This is the important part of recursive forecasting
    revenue_history.append(predicted_revenue)


# -----------------------------------
# 4. Create forecast DataFrame
# -----------------------------------

forecast_df = pd.DataFrame(future_predictions)

print("\nFuture Sales Forecast:")
print(forecast_df.to_string(index=False))


# -----------------------------------
# 5. Calculate total predicted revenue
# -----------------------------------

total_forecast = forecast_df["predictedRevenue"].sum()

average_forecast = forecast_df["predictedRevenue"].mean()

print("\n========== FORECAST SUMMARY ==========")

print("Forecast Days:", days)

print("Total Predicted Revenue: ₹",
      round(total_forecast, 2))

print("Average Daily Revenue: ₹",
      round(average_forecast, 2))


# -----------------------------------
# 6. Save forecast
# -----------------------------------

forecast_df.to_csv(
    "future_sales_forecast.csv",
    index=False
)

print("\nForecast saved successfully!")


# -----------------------------------
# 7. Visualize forecast
# -----------------------------------

plt.figure(figsize=(12, 5))

plt.plot(
    forecast_df["date"],
    forecast_df["predictedRevenue"],
    marker="o",
    label="Predicted Revenue"
)

plt.title("Future Sales Forecast")

plt.xlabel("Date")
plt.ylabel("Revenue (₹)")

plt.legend()
plt.xticks(rotation=45)

plt.tight_layout()

plt.savefig("future_sales_forecast.png")

plt.show()
