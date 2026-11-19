import pandas as pd
import matplotlib.pyplot as plt

# Load our daily sales dataset
df = pd.read_csv("daily_sales.csv", parse_dates=["date"])

print("\nFirst 5 rows:")
print(df.head())

print("\nDataset information:")
print(df.info())

print("\nStatistical summary:")
print(df.describe())

print("\nTotal revenue:", df["dailyRevenue"].sum())
print("Total units sold:", df["dailyUnits"].sum())
print("Total orders:", df["orderCount"].sum())

# Plot daily revenue
plt.figure(figsize=(12, 5))
plt.plot(df["date"], df["dailyRevenue"], marker="o")
plt.title("Daily Revenue")
plt.xlabel("Date")
plt.ylabel("Revenue (₹)")
plt.xticks(rotation=45)
plt.grid()
plt.tight_layout()
plt.show()

# Plot daily units
plt.figure(figsize=(12, 5))
plt.plot(df["date"], df["dailyUnits"], marker="o")
plt.title("Daily Units Sold")
plt.xlabel("Date")
plt.ylabel("Units")
plt.xticks(rotation=45)
plt.grid()
plt.tight_layout()
plt.show()