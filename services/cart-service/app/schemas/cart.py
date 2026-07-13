from app.extensions import ma
from app.models.cart import Cart, CartItem
from marshmallow import fields

class CartItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CartItem
        load_instance = True
        include_fk = True

class CartSchema(ma.SQLAlchemyAutoSchema):
    items = fields.Nested(CartItemSchema, many=True)

    class Meta:
        model = Cart
        load_instance = True
