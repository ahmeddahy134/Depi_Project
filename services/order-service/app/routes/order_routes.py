from flask import Blueprint, request, jsonify
from app.services.order_service import OrderService
from app.schemas.order_schema import order_schema, orders_schema
from marshmallow import ValidationError

order_bp = Blueprint('orders', __name__)
order_service = OrderService()

def get_session_id():
    session_id = request.headers.get('X-Session-ID')
    if not session_id:
        return None
    return session_id

@order_bp.route('/orders', methods=['POST'])
def create_order():
    session_id = get_session_id()
    if not session_id:
        return jsonify({'error': 'X-Session-ID header is missing'}), 401

    try:
        data = order_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify(err.messages), 400

    order = order_service.create_order(session_id, data)
    return jsonify(order_schema.dump(order)), 201

@order_bp.route('/orders', methods=['GET'])
def get_orders():
    session_id = get_session_id()
    if not session_id:
        return jsonify({'error': 'X-Session-ID header is missing'}), 401

    orders = order_service.get_orders(session_id)
    return jsonify(orders_schema.dump(orders)), 200

@order_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    session_id = get_session_id()
    if not session_id:
        return jsonify({'error': 'X-Session-ID header is missing'}), 401

    order = order_service.get_order(order_id, session_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify(order_schema.dump(order)), 200

@order_bp.route('/orders/<int:order_id>/cancel', methods=['PUT'])
def cancel_order(order_id):
    session_id = get_session_id()
    if not session_id:
        return jsonify({'error': 'X-Session-ID header is missing'}), 401

    order = order_service.cancel_order(order_id, session_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify(order_schema.dump(order)), 200
