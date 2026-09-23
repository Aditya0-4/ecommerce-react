from flask import Flask,request
from pymongo import MongoClient
app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017/")
db = client["cosmo_roots_db"]

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

@app.route("/update-products/<int:product_id>",methods=["PUT"])
def update_product(product_id):
  data = request.get_json()
  result = db.products.update_one(
    {"id":product_id},
    {"$set":data}
  )
  if result.matched_count == 0:
    return {"error": "Product not found"},404

  return {"message": "Product updated successfully"}

@app.route("/check-db")
def check_db():
    print("Database:", db.name)
    print("Collections:", db.list_collection_names())
    print("Product count:", db.products.count_documents({}))

    return {
        "database": db.name,
        "collections": db.list_collection_names(),
        "product_count": db.products.count_documents({})
    }

if __name__ == "__main__":
  app.run(debug=True)