from api.v1.views import app_views
from flask import jsonify
from models import storage
from models.user import User
from models.seller_user import Seller
from models.product import Product
from models.order import Order


@app_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """status of API"""
    return jsonify({"status": "OK"})

@app_views.route('/stats', methods=['GET'], strict_slashes=False)
def get_stats():
    stats = {}
    classes = [User, Seller, Order, Product]
    names = ["users", "sellers", "products", "orders"]
    for i in range(len(classes)):
        stats[names[i]] = storage.count(classes[i])
        
    return jsonify(stats)
        