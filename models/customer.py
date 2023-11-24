from models.base_model import BaseModel, Base
from hashlib import md5
from sqlalchemy import String, Column,Float, Integer



class Customer(BaseModel, Base):
    """creates a new user"""
    __tablename__ = 'customer'
    product_name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    bundle = Column(Integer, nullable=False)
    Inches = Column(Integer, nullable=False)
    color = Column(String(50), nullable=False)
    image_path = Column(String(255), nullable=False)
    
    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)
