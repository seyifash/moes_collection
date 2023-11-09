from models.base_model import Base
from models.user import User
from models.customer import Customer
from sqlalchemy import (create_engine)
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm.session import sessionmaker

class BDBStorage:
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
        the_dict = {}
        if cls:
            result = self.__session.query(cls)
            for res in result:
                key = "{}.{}".format(res.__class__.__name__, res.id)
                the_dict[key] = res
        else:
            classlist = [User, Customer]
            for cl in classlist:
                all_cls = self.__session.query(cl)
                for el in all_cls:
                    key = "{}.{}".format(el.__class__.__name__, el.id)
                    the_dict[key] = el
                    
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