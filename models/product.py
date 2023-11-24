from models.base_model import BaseModel, Base
from hashlib import md5
from sqlalchemy import String, Column,Float, Integer, ForeignKey
from sqlalchemy.orm import relationship


class Product(BaseModel, Base):
    """creates a new product"""
    __tablename__ = 'product'
    product_name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    bundle = Column(Integer, nullable=False)
    Inches = Column(Integer, nullable=False)
    color = Column(String(50), nullable=False)
    image_path = Column(String(255), nullable=False)
    seller_id = Column(String(60), ForeignKey('seller.id'))
    seller = relationship('Seller', back_populates='products')
    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)
