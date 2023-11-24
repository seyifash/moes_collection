from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'Ayomide'
    
    from .views import views
    from .auth import auth
    from .seller_auth import seller_auth
    from .seller_views import seller_views
    
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(seller_auth, url_prefix='/')
    app.register_blueprint(seller_views, url_prefix='/')
    
    return app