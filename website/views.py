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
    orderData = [] 
    if request.method == 'POST':
        inchesDictionary = request.json.get('inchesDictionary')
        # Initialize an empty dictionary

        for key, value in inchesDictionary.items():
            productInches = key
            for l, e in value.items():
                productGram = l
                productName = e['productName']
                productPrice = e['productPrice']
                productQuantity = e['quantity']
                productTotal = e['total']
                seller_id = e['sellerId']
                order_item = {
                    'productInches': productInches,
                    'productGram': productGram,
                    'productName': productName,
                    'productPrice': productPrice,
                    'productQuantity': productQuantity,
                    'productTotal': productTotal,
                    'user_id': user_id,
                    'seller_id': seller_id
                }
                orderData.append(order_item)
        print('orderData:', orderData)
        order_data_json = json.dumps(orderData)
        session['orderData'] = order_data_json
        print("Session keys:", session.keys())
        print("Content from session:", session.get('content'))
        print("OrderData from session:", session.get('orderData'))
        return order_data_json
    
    inchesDict = session.get('orderData')
    print("the data: ".format(inchesDict))
    return render_template('display_cart.html', inchesDict=inchesDict, user_id=user_id)
        