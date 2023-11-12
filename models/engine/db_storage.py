from models.base_model import BaseModel, Base
from models.user import User
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm.session import sessionmaker

classes = {"User": User}

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
        