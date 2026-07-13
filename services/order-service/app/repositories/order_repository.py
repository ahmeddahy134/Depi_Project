from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem

class OrderRepository:
    def get_all_by_session(self, session_id):
        return Order.query.filter_by(session_id=session_id).all()

    def get_by_id_and_session(self, order_id, session_id):
        return Order.query.filter_by(id=order_id, session_id=session_id).first()

    def create(self, order, items):
        db.session.add(order)
        db.session.flush() # To get order.id for items
        for item in items:
            item.order_id = order.id
            db.session.add(item)
        db.session.commit()
        return order

    def update_status(self, order, status):
        order.status = status
        db.session.commit()
        return order
