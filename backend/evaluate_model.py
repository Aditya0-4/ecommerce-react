
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.metrics import mean_absolute_error, mean_squared_error

# Load predictions
pred = pd.read_csv("model_predictions.csv")

# Load processed dataset
df = pd.read_csv("processed_sales.csv")

# Get test data
split_index = int(len(df) * 0.8)
test_data = df.iloc[split_index:].copy()

# Actual and predicted revenue
actual = pred["actual_revenue"]
predicted = pred["predicted_revenue"]

# --------------------------------
# 1. Calculate prediction errors
# --------------------------------

pred["error"] = actual - predicted

pred["absolute_error"] = abs(pred["error"])

pred["percentage_error"] = (
    pred["absolute_error"] / actual.replace(0, np.nan)
) * 100

print("\nPrediction Analysis:")
print(pred.head(10))

print("\nAverage Absolute Error:",
      round(pred["absolute_error"].mean(), 2))

# --------------------------------
# 2. Baseline comparison
# --------------------------------

# Predict today's revenue using yesterday's actual revenue
baseline = test_data["revenue_lag_1"]

baseline_mae = mean_absolute_error(actual, baseline)

baseline_rmse = np.sqrt(
    mean_squared_error(actual, baseline)
)

model_mae = mean_absolute_error(actual, predicted)

model_rmse = np.sqrt(
    mean_squared_error(actual, predicted)
)

print("\n========== BASELINE COMPARISON ==========")

print("Baseline MAE:", round(baseline_mae, 2))
print("Model MAE:", round(model_mae, 2))

print("Baseline RMSE:", round(baseline_rmse, 2))
print("Model RMSE:", round(model_rmse, 2))

# --------------------------------
# 3. Actual vs Predicted graph
# --------------------------------

plt.figure(figsize=(12, 5))

plt.plot(
    pred["date"],
    actual,
    label="Actual Revenue",
    marker="o"
)

plt.plot(
    pred["date"],
    predicted,
    label="Predicted Revenue",
    marker="o"
)

plt.title("Actual vs Predicted Revenue")

plt.xlabel("Date")
plt.ylabel("Revenue (₹)")

plt.legend()
plt.xticks(rotation=45)

plt.tight_layout()

plt.savefig("actual_vs_predicted.png")

plt.show()

# --------------------------------
# 4. Prediction error graph
# --------------------------------

plt.figure(figsize=(12, 5))

plt.bar(
    pred["date"],
    pred["error"]
)

plt.axhline(y=0, linestyle="--")

plt.title("Daily Prediction Errors")

plt.xlabel("Date")
plt.ylabel("Error (₹)")

plt.xticks(rotation=45)

plt.tight_layout()

plt.savefig("prediction_errors.png")

plt.show()

print("\nEvaluation completed!")
