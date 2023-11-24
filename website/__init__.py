from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'Ayomide'
    
    from .views import views
    from .auth import auth
    from .calculator import calculator
    
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(calculator, url_prefix='/')
    
    return app