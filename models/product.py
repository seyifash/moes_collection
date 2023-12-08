from models.base_model import BaseModel, Base
from sqlalchemy import String, Column, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship


class Product(BaseModel, Base):
    """creates a new product"""
    __tablename__ = 'product'
    productName = Column(String(255), nullable=False)
    productPrice = Column(Integer, nullable=False)
    productQuantity = Column(Integer, nullable=False)
    productInches = Column(Integer, nullable=False)
    productColor = Column(String(50), nullable=False)
    productImage = Column(String(255), nullable=False)
    productPricePerInch = Column(Integer, nullable=False)
    inchesAboveTwenty = Column(Integer, nullable=False)
    seller_id = Column(String(60), ForeignKey('seller.id'), nullable=False)
    orders = relationship('Order', backref='product')

