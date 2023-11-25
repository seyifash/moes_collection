from models.base_model import BaseModel, Base
from sqlalchemy import String, Column, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship


class Product(BaseModel, Base):
    """creates a new product"""
    __tablename__ = 'product'
    productName = Column(String(255), nullable=False)
    productPrice = Column(Float, nullable=False)
    productQuantity = Column(Integer, nullable=False)
    productInches = Column(Integer, nullable=False)
    productColor = Column(String(50), nullable=False)
    productImage = Column(String(255), nullable=False)
    seller_id = Column(String(60), ForeignKey('seller.id'), nullable=False)
