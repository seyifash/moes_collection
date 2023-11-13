from flask import Blueprint, render_template, request, flash, redirect, url_for
from models.user import User
from models import storage


auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        existingUser = storage.get(User, email)
        if existingUser:
            if password == existingUser.password:
                flash('Logged in sucessfully', category='success')
            else:
                flash('Incorrect password, try again', category='error')       
    return render_template("login.html")

@auth.route('/logout')
def logout():
    return render_template("logout.html")

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        password = request.form.get('password')
        password2 = request.form.get('password2')
        
        if len(email) < 4:
            flash('Email must be greater than 3 characters', category='error')
        elif len(first_name) < 3:
            flash('First name must be greater than 2 characters', category='error') 
        elif len(last_name) < 3:
            flash('Last name must be greater than 2 characters', category='error') 
        elif password != password2:
            flash('Passwords don\'t match', category='error')
        elif len(password) < 4:
            flash('Passwords must be at least 4 characters', category='error')
        else:
            new_user = request.form.to_dict()
            new_user.pop('password2')
            created_user = User(**new_user)
            created_user.save()
            flash('Account created!', category='success')
            return redirect(url_for('views.mainViews'))
    return render_template("signup.html")