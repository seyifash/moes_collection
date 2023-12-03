from models.base_model import BaseModel, Base
from models.user import User
from models.product import Product
from models.seller_user import Seller
from models.order import Order
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm.session import sessionmaker

classes = {"User": User, "Product": Product, "Seller": Seller, "Order": Order}

class DBStorage:
    """ data storage using sqlalchemy"""
    __engine = None
    __session =  None
    
    def __init__(self):
        """Initialization."""
        user = 'moes_collection'
        pwd = 'Mosunmola'
        host = 'localhost'
        db = 'moes_collection_db'  
        self.__engine = create_engine("mysql+pymysql://{}:{}@{}/{}".format(user, pwd, host, db), pool_pre_ping=True)
            
    def all(self, cls=None):
        """query on the current database session"""
        new_dict = {}
        for clss in classes:
            if cls is None or cls is classes[clss] or cls is clss:
                objs = self.__session.query(classes[clss]).all()
                for obj in objs:
                    key = obj.__class__.__name__ + '.' + obj.id
                    new_dict[key] = obj
        return (new_dict)
    
    def new(self, obj):
        """new objects are created and added """
        self.__session.add(obj)
        
    def save(self):
        """save the newly created obj to the database"""
        self.__session.commit()
        
    def delete(self, obj=None):
        if obj:
            self.__session.delete(obj)
            
    def reload(self):
        Base.metadata.create_all(self.__engine)
        session =  sessionmaker(bind=self.__engine, expire_on_commit=False)
        self.__session = scoped_session(session)
        
    def close(self):
        """removes a session"""
        self.__session.remove()
    
    def get_by_email(self, cls, email):
        if cls:
            if cls in classes.values():
                return self.__session.query(cls).filter_by(email=email).first()
            return None
        
    def get_user_by_id(self, cls, user_id):
        """Get a user by ID."""
        if cls and cls in classes.values():
            return self.__session.query(cls).get(user_id )
        return None
    
    def get_orders_by_user_id(self, cls, user_id):
        if cls in classes.values():
            cls_items = self.all(cls)
            l = [l for l in cls_items.values() if l.user_id == user_id]
            return l
        return None
    
    def get_sellers_orders(self, seller_id):
        results = []
        seller_class = classes.get('Seller')
        if seller_class:
            seller = self.get_user_by_id(seller_class, seller_id)
        if seller:
            orders = seller.orders
            for order in orders:
                user = self.get_user_by_id(User, order.user_id)
                results.append((order, user))

        return results          