from flask import Blueprint, render_template, request, jsonify, session

from models import storage

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("home.html")


@views.route('/main_views')
def mainViews():
    products = storage.all("Product")
    return render_template("views.html", products=products)

@views.route('/display_selects', methods=['GET', 'POST'])
def display():
    content = request.args.get('content', '')
    return render_template('display.html', content=content)

@views.route('/display_cart', methods=['GET', 'POST'])
def display_cart():
    
    if request.method == 'POST':
        # Assuming inchesDictionary is available in the JavaScript file
        inchesDictionary = request.json.get('inchesDictionary')
        print('Received inchesDictionary:', inchesDictionary)
        session['inchesDictionary'] = inchesDictionary
        return jsonify(inchesDictionary)
    inchesDictionary = session.get('inchesDictionary', {})   
    print('Rendering display_cart.html')
    print('Received inchesDictionary:', inchesDictionary)
    return render_template('display_cart.html', inchesDictionary=inchesDictionary)
        