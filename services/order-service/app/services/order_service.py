from app.repositories.order_repository import OrderRepository
from app.models.order import Order
from app.models.order_item import OrderItem

class OrderService:
    def __init__(self):
        self.repository = OrderRepository()

    def get_orders(self, session_id):
        return self.repository.get_all_by_session(session_id)

    def get_order(self, order_id, session_id):
        return self.repository.get_by_id_and_session(order_id, session_id)

    def create_order(self, session_id, data):
        total_amount = 0
        items = []
        for item_data in data['items']:
            item_total = item_data['quantity'] * item_data['unit_price']
            total_amount += item_total
            item = OrderItem(
                product_id=item_data['product_id'],
                product_name=item_data['product_name'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_total
            )
            items.append(item)
        
        order = Order(
            session_id=session_id,
            status='pending',
            total_amount=total_amount,
            shipping_address=data['shipping_address'],
            phone=data['phone'],
            payment_method=data['payment_method']
        )
        return self.repository.create(order, items)

    def cancel_order(self, order_id, session_id):
        order = self.repository.get_by_id_and_session(order_id, session_id)
        if not order:
            return None
        if order.status != 'cancelled':
            return self.repository.update_status(order, 'cancelled')
        return order
