from flask import Blueprint, render_template, redirect, url_for
from models.user import User

calculator = Blueprint('calculator', __name__)

@calculator.route('/product', methods=['GET', 'POST'])
def product_bag():
    return render_template("calc_quant.html")