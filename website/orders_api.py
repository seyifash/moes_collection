from models import storage
from models.order import Order
from flask import Blueprint
from flask import abort, jsonify, make_response, request

orders_api = Blueprint('orders_api', __name__)

@orders_api.route('/orders', methods=['GET'], strict_slashes=False)
def get_orders():
    orders =[]
    for order in  storage.all(Order).values():
        orders.append(order.to_dict())
    return jsonify(orders)

@orders_api.route('/orders/<order_id>', methods=['GET'], strict_slashes=False)
def get_orders_byid(order_id):
    orders = storage.get_user_by_id(Order, order_id)
    print("the orders".format(orders))
    if orders is None:
        abort(404)
    return jsonify(orders.to_dict()) 

@orders_api.route('/orders/<order_id>', methods=['DELETE'], strict_slashes=False)
def delete_orders(order_id):
    orders = storage.get_user_by_id(Order, order_id)
    if orders is None:
        abort(404)
    orders.delete()
    storage.save()
    return jsonify({})

@orders_api.route('/orders', methods=['POST'], strict_slashes=False)
def Post_orders():
    if not request.get_json():
        abort(400, description="Not a JSON")
    data = request.get_json()
    orders = Order(**data)
    orders.save()
    
    return make_response(jsonify(orders.to_dict()), 201)

@orders_api.route('/orders/<order_id>', methods=['PUT'], strict_slashes=False)
def put_order(order_id):
    """update a order"""
    
    print(order_id)
    if not request.get_json():
        abort(400, description="Not a Json")
    order = storage.get_user_by_id(Order, order_id)
    if order is None:
        print("order is none")
        abort(404)
    for key, value in request.get_json().items():
        if key not in ['id', 'created_at', 'updated_at', 'user_id', 'seller_id']:
            setattr(order, key, value)
    storage.save()
    return make_response(jsonify(order.to_dict()))