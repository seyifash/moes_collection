from flask import Blueprint, render_template, request, flash, redirect, url_for, current_app
from flask_login import current_user, login_required
from models.product import Product
from werkzeug.utils import secure_filename
import os
from models import storage

seller_views = Blueprint('seller_views', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@seller_views.route('/seller')
def home():
    return render_template("seller_home.html")

@seller_views.route('/seller_upload', methods=['GET', 'POST'])
@login_required
def sellerViews():
    if request.method == 'POST' and current_user.is_authenticated:
        new_product = request.form.to_dict()
        if 'productImage' in request.files:
            uploaded_file = request.files['productImage']
            if uploaded_file.filename != '' and allowed_file(uploaded_file.filename):
                filename = secure_filename(uploaded_file.filename)
                file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                 # Save the file to a folder
                uploaded_file.save(file_path)
                # Set the 'productImage' field to the file path
                new_product['productImage'] = file_path
            else:
                flash('Invalid or missing file. Please upload a valid image file.', category='error')
            new_product['seller_id'] = current_user.id
            created_product = Product(**new_product)
            print(created_product)
            created_product.save()
    return render_template('seller.html')

@seller_views.route('/seller_orders', methods=['GET', 'POST'])
def sellers_order():
    all_orders = storage.get_sellers_orders(current_user.id)
    
    return render_template('seller_orders.html', all_orders=all_orders)
