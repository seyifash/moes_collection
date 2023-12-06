from models import storage
from models.product import Product
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request


@app_views.route('/product', methods=['GET'], strict_slashes=False)
def get_products():
    products =[]
    for product in  storage.all(Product).values():
        products.append(product.to_dict())
    return jsonify(products)

@app_views.route('/products/<product_id>', methods=['GET'], strict_slashes=False)
def get_product_byid(product_id):
    products = storage.get_user_by_id(Product, product_id)
    if products is None:
        abort(404)
    return jsonify(products.to_dict()) 

@app_views.route('/products/<product_id>', methods=['DELETE'], strict_slashes=False)
def delete_products(product_id):
    products = storage.get_user_by_id(Product, product_id)
    if products is None:
        abort(404)
    products.delete()
    storage.save()
    return jsonify({})

@app_views.route('/products', methods=['POST'], strict_slashes=False)
def Post_product():
    if not request.get_json():
        abort(400, description="Not a JSON")
    data = request.get_json()
    product = Product(**data)
    product.save()
    
    return make_response(jsonify(product.to_dict()), 201)

@app_views.route('/products/<product_id>', methods=['PUT'], strict_slashes=False)
def put_product(product_id):
    """update a user"""
    if not request.get_json():
        abort(400, description="Not a Json")
    product = storage.get_user_by_id(Product, product_id)
    if product is None:
        abort(404)
    for key, value in request.get_json().items:
        if key not in ['id', 'created_at', 'updated_at']:
            setattr(product, key, value)
    storage.save()
    return make_response(jsonify(product.to_dict()))