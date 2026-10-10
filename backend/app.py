from flask import Flask,request,jsonify
from pymongo import MongoClient
from flask_cors import CORS
import bcrypt
from bson import ObjectId
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta
from datetime import datetime, timezone

app = Flask(__name__)

CORS(app)

app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"  # Change this to a secure key in production
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)  # Token expires in 1 hour
JWTManager(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["cosmo_roots_db"]

@app.errorhandler(404)
def not_found(error):
  return jsonify({
    "error": "Resource not found"
  }), 404

@app.errorhandler(405)
def method_not_allowed(error):
  return jsonify({
    "error": "Method not allowed"
  }), 405

@app.errorhandler(500)
def internal_server_error(error):
  return jsonify({
    "error": "Internal server error"
  }), 500

@app.route("/")
def home():
  return "Cosmo Roots Backend is Running"

@app.route("/test-db")
def test_db():
  test_data = {
    "message": "MongoDB connection is working"
  }
  db.test.insert_one(test_data)
  return "Test data inserted into MongoDB"

@app.route("/add-products", methods=["POST"])
def add_product():
  products = request.get_json()
  if not isinstance(products,list):
    return {"error": "Please send products as JSON array"}

  if len(products) == 0:
    return {"error": "Product list cannot be empty"}

  result = db.products.insert_many(products)

  return {
    "message": "Products added successfully",
    "inserted_count": len(result.inserted_ids)
  },201

@app.route("/get-products", methods=["GET"])
def get_products():
  products = list(db.products.find({},{"_id": 0}))

  print("Products retrieved from MongoDB:", products)  # Debugging statement
  return {"products": products}

@app.route("/get-products/<int:product_id>", methods=["GET"])
def get_product_by_id(product_id):
  product = db.products.find_one(
    {"id":product_id},
    {"_id":0}
  )

  if product is None:
    return {"error": "product not found"}, 404

  return product

@app.route("/update-products",methods=["PATCH"])
def update_product():
    data = request.get_json()
    if not data:
      return {"error": "Request body is required"},400
    if "Category" not in data:
      return {"error": "Category is required"},400
    if "update" not in data:
      return {"error": "Update data is required"},400
    if not isinstance(data["Category"],list):
      return {"error": "Category must be a list"},400
    if not isinstance(data["update"],dict):
      return {"error": "Update data must be a dictionary"},400
    
    result = db.products.update_many(
      {"Category":{"$in": data["Category"]}},
      {"$set":data["update"]}
    )
  
    return {
      "message": "Products updated successfully",
      "matched_count": result.matched_count,
      "modified_count": result.modified_count
    }

@app.route("/remove-fields",methods=["PATCH"])
def remove_fields():
  data = request.get_json()
  result = db.products.update_many(
    {"Category":{"$in": data["Category"]}},
    {"$unset":data["remove"]}
  )

  return {
    "message": "Fields updated successfully",
    "matched_count": result.matched_count,
    "modified_count": result.modified_count
  }

@app.route("/delete-products/<int:product_id>",methods=["DELETE"])
def delete_product(product_id):
  result = db.products.delete_one({"id":product_id})
  if result.deleted_count == 0:
    return {"error": "Product not found"},404

  return {"message": "Product deleted successfully"}

# @app.route("/check-db")
# def check_db():
#     print("Database:", db.name)
#     print("Collections:", db.list_collection_names())
#     print("Product count:", db.products.count_documents({}))

#     return {
#         "database": db.name,
#         "collections": db.list_collection_names(),
#         "product_count": db.products.count_documents({})
#     }

@app.route("/orders", methods=["POST"])
def create_order():
  data =  request.get_json()

  print("Received order data:", data)  # Debugging statement

  if not data:
    return {"error": "Request body is required"},400
  if "items" not in data:
    return {"error": "Items are required"},400
  if "totalamount" not in data:
    return {"error": "Total amount is required"},400

  order = {
    "items": data["items"],
    "totalamount": data["totalamount"],
    "created_at": datetime.now(timezone.utc)
  }

  result = db.orders.insert_one(order)

  return {
    "message": "Order created successfully",
    "order_id": str(result.inserted_id)
  }, 201

@app.route("/register", methods=["POST"])
def register():
  data = request.get_json()

  if not data:
    return {"error": "Request body is required"},400

  name = data.get("name")
  email = data.get("email")
  password = data.get("password")

  if not name or not email or not password:
    return{
      "error": "Name, email, and password are required"
    }, 400

  existing_user = db.users.find_one({
    'email': email
  })

  if existing_user:
    return {
      'error': 'User with this email already exists'
    }, 409

  hashed_password = bcrypt.hashpw(
    password.encode("utf-8"),
    bcrypt.gensalt()
  )

  user = {
    "name": name,
    "email": email,
    "password": hashed_password.decode("utf-8"),
    "role": "user"
  }

  result = db.users.insert_one(user)

  return {
    "message": "User registered successfully",
    "user_id": str(result.inserted_id)
  }, 201

@app.route("/login", methods=["POST"])
def login():

  data = request.get_json()

  if not data:
    return {"error": "Request body is required"},400

  email = data.get("email")
  password = data.get("password")

  if not email or not password:
    return {
      "error": "Email and password are required"
    }, 400

  user = db.users.find_one(
    {"email": email}
  )

  if not user:
    return {
      "error": "Invalid email or password"
    }, 401

  password_correct = bcrypt.checkpw(
    password.encode("utf-8"),
    user["password"].encode("utf-8") # Converts hashed string to bytes
  )

  if not password_correct:
    return {
      "error": "Invalid email or password"
    }, 401

  role =user.get("role", "user")
  access_token = create_access_token(
    identity=str(user["_id"]),
    additional_claims={"role": role}
  )

  return {
    "message": "Login successful",
    "access_token": access_token,
    "user": {
      "name": user["name"],
      "email": user["email"],
      "role": role
    }
  }, 200

@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():

  user_id = get_jwt_identity()
  user = db.users.find_one({
    "_id": ObjectId(user_id)
  })

  if not user:
    return{
      "error": "User not found"
    }, 404

  return{
    "message": "You are authenticated",
    "user": {
      "name": user["name"],
      "email": user["email"]
    }
  }, 200


@app.route("/sales-analytics", methods=["GET"])
@jwt_required()
def sales_analytics():
    orders = list(db.orders.find({}))

    total_revenue = 0
    total_units = 0
    product_stats = {}
    monthly_stats = {}

    now = datetime.now(timezone.utc)

    # Prepare the current month and previous five months.
    months = []
    year = now.year
    month = now.month

    for _ in range(6):
        key = f"{year}-{month:02d}"
        months.append(key)
        monthly_stats[key] = 0

        month -= 1
        if month == 0:
            month = 12
            year -= 1

    months.reverse()

    for order in orders:
        amount = float(order.get("totalamount", 0) or 0)
        total_revenue += amount

        # Use the saved order date when available.
        # Older orders can use their MongoDB ObjectId timestamp.
        order_date = order.get("created_at")

        if not isinstance(order_date, datetime):
            order_id = order.get("_id")
            order_date = (
                order_id.generation_time
                if isinstance(order_id, ObjectId)
                else None
            )

        if order_date:
            if order_date.tzinfo is None:
                order_date = order_date.replace(
                    tzinfo=timezone.utc
                )

            month_key = order_date.strftime("%Y-%m")

            if month_key in monthly_stats:
                monthly_stats[month_key] += amount

        for item in order.get("items", []):
            name = item.get("name", "Unknown Product")
            quantity = int(item.get("quantity", 0) or 0)
            price = float(item.get("price", 0) or 0)

            total_units += quantity

            if name not in product_stats:
                product_stats[name] = {
                    "name": name,
                    "units_sold": 0,
                    "revenue": 0
                }

            product_stats[name]["units_sold"] += quantity
            product_stats[name]["revenue"] += price * quantity

    products = sorted(
        product_stats.values(),
        key=lambda product: product["revenue"],
        reverse=True
    )

    return jsonify({
        "total_revenue": round(total_revenue, 2),
        "order_count": len(orders),
        "units_sold": total_units,
        "average_order_value": round(
            total_revenue / len(orders), 2
        ) if orders else 0,
        "product_performance": products,
        "monthly_revenue": [
            {
                "month": key,
                "revenue": round(monthly_stats[key], 2)
            }
            for key in months
        ]
    }), 200


if __name__ == "__main__":
  app.run(debug=True)