from flask import Blueprint, render_template

seller_views = Blueprint('seller_views', __name__)

@seller_views.route('/seller')
def home():
    return render_template("seller_home.html")

@seller_views.route('/seller_upload')
def sellerViews():
    return render_template("seller.html")