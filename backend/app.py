from flask import Flask,request,jsonify
from pymongo import MongoClient
app = Flask(__name__)

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