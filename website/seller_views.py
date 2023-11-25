from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import current_user, login_required
from models.product import Product
from models import storage

seller_views = Blueprint('seller_views', __name__)

@seller_views.route('/seller')
def home():
    return render_template("seller_home.html")

@seller_views.route('/seller_upload', methods=['GET', 'POST'])
@login_required
def sellerViews():
    if request.method == 'POST':
        new_product = request.form.to_dict()
        created_product = Product(**new_product)
        print(created_product)
        created_product.save()
    return render_template('seller.html')