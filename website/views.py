from flask import Blueprint, render_template, request, jsonify, session
from models.order import Order
import json

from models import storage

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("home.html")


@views.route('/main_views/<user_id>')
def mainViews(user_id):
    products = storage.all("Product")
    return render_template("views.html", products=products, user_id=user_id)

@views.route('/display_selects/<user_id>', methods=['GET', 'POST'])
def display_select(user_id):
    if request.method == 'POST':
        # Get the JSON data from the request
        json_data = request.get_json()
        # Extract the content from the JSON data
        content = json_data.get('content', {})
        # Store the content in the session
        session['content'] = content
        return jsonify({'message': 'Content received successfully'})
    
    content_from_session = session.get('content', {})
    return render_template('display.html', user_id=user_id, contents=content_from_session)

@views.route('/display_cart/<user_id>', methods=['GET', 'POST'])
def display_cart(user_id):
    
    if request.method == 'POST':
        data = request.get_json()

        # Extract values from the data
        latestEntry = data.get('latestEntry')
        productInches = data.get('latestInches')
        for productGram, e in latestEntry.items():
            productName = e['productName']
            productPrice = e['productPrice']
            productQuantity = e['quantity']
            productTotal = e['total']
            seller_id = e['sellerId']
            orderData = {
            'productInches': productInches,
            'productGram': productGram,
            'productName': productName,
            'productPrice': productPrice,
            'productQuantity': productQuantity,
            'productTotal': productTotal,
            'user_id': user_id,
            'seller_id': seller_id
            }
            user_order = Order(**orderData)
            user_order.save()
        return jsonify(user_order.to_dict())
    elif request.method == 'GET':
        inchesDictionary = storage.get_orders_by_user_id(Order, user_id)
        return render_template('display_cart.html', inchesDictionary=inchesDictionary, user_id=user_id)
            