from app.models.cart import Cart, CartItem
from app.extensions import db

class CartRepository:
    def get_cart_by_session_id(self, session_id):
        return Cart.query.filter_by(session_id=session_id).first()

    def create_cart(self, session_id):
        cart = Cart(session_id=session_id)
        db.session.add(cart)
        db.session.commit()
        return cart

    def get_cart_item(self, cart_id, product_id):
        return CartItem.query.filter_by(cart_id=cart_id, product_id=product_id).first()

    def get_cart_item_by_id(self, item_id):
        return CartItem.query.get(item_id)

    def add_cart_item(self, item):
        db.session.add(item)
        db.session.commit()
        return item

    def update_cart_item(self, item):
        db.session.commit()
        return item

    def delete_cart_item(self, item):
        db.session.delete(item)
        db.session.commit()

    def delete_cart(self, cart):
        db.session.delete(cart)
        db.session.commit()
