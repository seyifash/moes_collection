from flask import Flask
from models import storage
from flask_login import LoginManager
from models.seller_user import Seller
from models.user import User


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'Ayomide'
    app.config['UPLOAD_FOLDER'] = r'website\static\uploads'
    
    from .views import views
    from .auth import auth
    from .seller_auth import seller_auth
    from .seller_views import seller_views
    from .orders_api import orders_api
    
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(seller_auth, url_prefix='/')
    app.register_blueprint(seller_views, url_prefix='/')
    app.register_blueprint(orders_api, url_prefix='/')
    
    login_manager = LoginManager()
    login_manager.login_view = 'seller_auth.seller_login'
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(id):
        user_classes = [Seller, User]  # Add more classes as needed

        for user_class in user_classes:
            user = storage.get_user_by_id(user_class, id)
            if user:
                return user
        return None
    
    return app