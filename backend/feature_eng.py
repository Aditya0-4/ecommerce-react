
import pandas as pd

# Load original dataset
df = pd.read_csv("daily_sales.csv")

# Remove unnecessary CSV index column if present
df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

# Convert date into datetime
df["date"] = pd.to_datetime(df["date"])

# Sort data chronologically
df = df.sort_values("date").reset_index(drop=True)


# --------------------------------
# 1. Date-based features
# --------------------------------

df["day"] = df["date"].dt.day

df["month"] = df["date"].dt.month

df["dayOfWeek"] = df["date"].dt.dayofweek

df["isWeekend"] = (
    df["dayOfWeek"] >= 5
).astype(int)


# --------------------------------
# 2. Lag features
# --------------------------------

# Previous day's revenue
df["revenue_lag_1"] = df["dailyRevenue"].shift(1)

# Revenue seven days ago
df["revenue_lag_7"] = df["dailyRevenue"].shift(7)

# Previous day's units
df["units_lag_1"] = df["dailyUnits"].shift(1)

# Previous day's orders
df["orders_lag_1"] = df["orderCount"].shift(1)


# --------------------------------
# 3. Rolling average features
# --------------------------------

# Average revenue of previous 7 days
df["revenue_rolling_7"] = (
    df["dailyRevenue"].shift(1).rolling(window=7).mean()
)

# Average revenue of previous 14 days
df["revenue_rolling_14"] = (
    df["dailyRevenue"].shift(1).rolling(window=14).mean()
)


# --------------------------------
# 4. Remove missing values
# --------------------------------

df = df.dropna().reset_index(drop=True)


# --------------------------------
# 5. Save processed dataset
# --------------------------------

df.to_csv("processed_sales.csv", index=False)

print("\nFeature Engineering Completed!")

print("\nFirst 5 rows:")
print(df.head())

print("\nDataset Information:")
print(df.info())

print("\nFinal Dataset Shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())
