from models import storage
from models.seller_user import Seller
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request


@app_views.route('/sellers_api', methods=['GET'], strict_slashes=False)
def get_sellers():
    sellers =[]
    for seller in  storage.all(Seller).values():
        sellers.append(seller.to_dict())
    return jsonify(sellers)

@app_views.route('/sellers_api/<sellers_id>', methods=['GET'], strict_slashes=False)
def get_sellers_byid(sellers_id):
    sellers = storage.get_user_by_id(Seller, sellers_id)
    if sellers is None:
        abort(404)
    return jsonify(sellers.to_dict()) 

@app_views.route('/sellers_api/<sellers_id>', methods=['DELETE'], strict_slashes=False)
def delete_sellers(sellers_id):
    sellers = storage.get_user_by_id(Seller, sellers_id)
    if sellers is None:
        abort(404)
    sellers.delete()
    storage.save()
    return jsonify({})

@app_views.route('/sellers_api', methods=['POST'], strict_slashes=False)
def Post_seller():
    if not request.get_json():
        abort(400, description="Not a JSON")
    data = request.get_json()
    seller = Seller(**data)
    seller.save()
    
    return make_response(jsonify(seller.to_dict()), 201)

@app_views.route('/sellers_api/<sellers_id>', methods=['PUT'], strict_slashes=False)
def put_seller(sellers_id):
    """update a user"""
    if not request.get_json():
        abort(400, description="Not a Json")
    seller = storage.get_user_by_id(Seller, sellers_id)
    if seller is None:
        abort(404)
    for key, value in request.get_json().items:
        if key not in ['id', 'created_at', 'updated_at']:
            setattr(seller, key, value)
    storage.save()
    return make_response(jsonify(seller.to_dict()))
        