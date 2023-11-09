from models.base_model import BaseModel, Base
from sqlalchemy import String, Column

class User(BaseModel, Base):
    """creates a new user"""
    __tablename__ = 'users'
    email = Column(String(128), nullable=False)
    password = Column(String(128), nullable=False)
    first_name = Column(String(128), nullable=False)
    last_name = Column(String(128), nullable=False)