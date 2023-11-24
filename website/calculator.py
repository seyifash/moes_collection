from flask import Blueprint, render_template, request, flash, redirect, url_for
from models.user import User
from models import storage

calcc = Blueprint('calcc', __name__)

@calcc.route('/product', methods=['GET', 'POST'])
def product_bag():
    return render_template(calc_quant.html)