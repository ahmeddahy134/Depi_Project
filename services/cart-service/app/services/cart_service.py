from app.repositories.cart_repository import CartRepository
from app.models.cart import CartItem

class CartService:
    def __init__(self):
        self.repository = CartRepository()

    def get_or_create_cart(self, session_id):
        cart = self.repository.get_cart_by_session_id(session_id)
        if not cart:
            cart = self.repository.create_cart(session_id)
        return cart

    def get_cart(self, session_id):
        return self.get_or_create_cart(session_id)

    def add_item_to_cart(self, session_id, data):
        cart = self.get_or_create_cart(session_id)
        product_id = data.get('product_id')

        existing_item = self.repository.get_cart_item(cart.id, product_id)

        if existing_item:
            existing_item.quantity += data.get('quantity', 1)
            return self.repository.update_cart_item(existing_item)
        else:
            new_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                product_name=data.get('product_name'),
                product_price=data.get('product_price'),
                product_image=data.get('product_image'),
                quantity=data.get('quantity', 1)
            )
            return self.repository.add_cart_item(new_item)

    def update_item_quantity(self, session_id, item_id, quantity):
        cart = self.repository.get_cart_by_session_id(session_id)
        if not cart:
            raise ValueError("Cart not found")

        item = self.repository.get_cart_item_by_id(item_id)
        if not item or item.cart_id != cart.id:
            raise ValueError("Item not found in cart")

        if quantity <= 0:
            self.repository.delete_cart_item(item)
            return None
        else:
            item.quantity = quantity
            return self.repository.update_cart_item(item)

    def remove_item_from_cart(self, session_id, item_id):
        cart = self.repository.get_cart_by_session_id(session_id)
        if not cart:
            raise ValueError("Cart not found")

        item = self.repository.get_cart_item_by_id(item_id)
        if not item or item.cart_id != cart.id:
            raise ValueError("Item not found in cart")

        self.repository.delete_cart_item(item)

    def clear_cart(self, session_id):
        cart = self.repository.get_cart_by_session_id(session_id)
        if cart:
            self.repository.delete_cart(cart)
