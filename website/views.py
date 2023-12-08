from flask import Blueprint, render_template, request, jsonify, session
from models.order import Order
from models.product import Product
from models import storage


views = Blueprint('views', __name__)

@views.before_request
def before_request():
    storage.reload()  # Reload the database session before each request

@views.teardown_request
def teardown_request(exception=None):
    storage.close()  # Close the database session after each request


@views.route('/')
def home():
    return render_template("home.html")


@views.route('/main_views/<user_id>')
def mainViews(user_id):
    products = storage.all("Product")
    return render_template("views.html", products=products, user_id=user_id)

@views.route('/display_selects/<user_id>/<product_id>', methods=['GET'])
def display_select(user_id, product_id):
    current_product = storage.get_user_by_id(Product, product_id)
    current_product.productImage = current_product.productImage.replace('\\', '/')
    current_product.productImage = current_product.productImage.split('website/static/', 1)[-1]
    current_product.productImage = current_product.productImage.replace('\\', '/')
    print("image path: {}".format(current_product.productImage))
    
    return render_template('display.html', user_id=user_id, content=current_product)

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
            seller_id = e['seller_id']
            product_id = e['product_id']
            orderData = {
            'productInches': productInches,
            'productGram': productGram,
            'productName': productName,
            'productPrice': productPrice,
            'productQuantity': productQuantity,
            'productTotal': productTotal,
            'user_id': user_id,
            'seller_id': seller_id,
            'product_id': product_id
            }
            user_order = Order(**orderData)
            user_order.save()
        return jsonify(user_order.to_dict())
    elif request.method == 'GET':
        inchesDictionary = storage.get_orders_by_user_id(Order, user_id)
        return render_template('display_cart.html', inchesDictionary=inchesDictionary, user_id=user_id)
    

            