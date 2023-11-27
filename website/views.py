from flask import Blueprint, render_template
from models import storage

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("home.html")


@views.route('/main_views')
def mainViews():
    products = storage.all("Product")
    return render_template("views.html", products=products)