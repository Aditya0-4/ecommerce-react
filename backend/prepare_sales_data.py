
from pymongo import MongoClient
import pandas as pd

# 1. Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["cosmo_roots_db"]

# 2. Aggregation pipeline
pipeline = [
    {
        "$group": {
            "_id": {
                "$dateTrunc": {
                    "date": {
                        "$toDate": {
                            "$ifNull": ["$orderDate", "$_id"]
                        }
                    },
                    "unit": "day",
                    "timezone": "Asia/Kolkata"
                }
            },
            "dailyRevenue": {
                "$sum": "$totalamount"
            },
            "dailyUnits": {
                "$sum": {
                    "$ifNull": [
                        "$totalUnits",
                        {
                            "$sum": {
                                "$map": {
                                    "input": {
                                        "$ifNull": ["$items", []]
                                    },
                                    "as": "item",
                                    "in": {
                                        "$ifNull": [
                                            "$$item.quantity", 0
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            "orderCount": {
                "$sum": 1
            }
        }
    },
    {
        "$sort": {"_id": 1}
    }
]

# 3. Execute aggregation
results = list(db.orders.aggregate(pipeline))

# 4. Convert into DataFrame
df = pd.DataFrame(results)

df.rename(columns={"_id": "date"}, inplace=True)

# 5. Convert MongoDB dates into Indian local dates
df["date"] = (
    pd.to_datetime(df["date"], utc=True)
    .dt.tz_convert("Asia/Kolkata")
    .dt.tz_localize(None)
    .dt.normalize()
)

# 6. Fill missing dates
df.set_index("date", inplace=True)

all_dates = pd.date_range(
    start=df.index.min(),
    end=df.index.max(),
    freq="D"
)

df = df.reindex(all_dates, fill_value=0)

df.index.name = "date"

# 7. Save dataset
df.to_csv("daily_sales.csv")

print("\nDaily Sales Dataset:")
print(df)

print("\nDataset Information:")
print(df.info())

print("\nTotal Days:", len(df))

# 8. Close connection
client.close()
