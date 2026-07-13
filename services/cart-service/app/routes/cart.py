from flask import Blueprint, request, jsonify
from app.services.cart_service import CartService
from app.schemas.cart import CartSchema, CartItemSchema
from functools import wraps

cart_bp = Blueprint('cart', __name__)
cart_service = CartService()
cart_schema = CartSchema()
cart_item_schema = CartItemSchema()

def require_session_id(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_id = request.headers.get('X-Session-ID')
        if not session_id:
            return jsonify({'error': 'Missing X-Session-ID header'}), 400
        return f(session_id, *args, **kwargs)
    return decorated_function

@cart_bp.route('/cart', methods=['GET'])
@require_session_id
def get_cart(session_id):
    cart = cart_service.get_cart(session_id)
    return jsonify(cart_schema.dump(cart)), 200

@cart_bp.route('/cart/items', methods=['POST'])
@require_session_id
def add_item(session_id):
    data = request.get_json()
    if not data or not data.get('product_id'):
        return jsonify({'error': 'Invalid request data'}), 400
    
    try:
        item = cart_service.add_item_to_cart(session_id, data)
        return jsonify(cart_item_schema.dump(item)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@cart_bp.route('/cart/items/<int:item_id>', methods=['PUT'])
@require_session_id
def update_item(session_id, item_id):
    data = request.get_json()
    if not data or 'quantity' not in data:
        return jsonify({'error': 'Missing quantity'}), 400
    
    try:
        item = cart_service.update_item_quantity(session_id, item_id, data['quantity'])
        if item:
            return jsonify(cart_item_schema.dump(item)), 200
        return jsonify({'message': 'Item removed'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@cart_bp.route('/cart/items/<int:item_id>', methods=['DELETE'])
@require_session_id
def delete_item(session_id, item_id):
    try:
        cart_service.remove_item_from_cart(session_id, item_id)
        return jsonify({'message': 'Item removed successfully'}), 204
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@cart_bp.route('/cart', methods=['DELETE'])
@require_session_id
def clear_cart(session_id):
    try:
        cart_service.clear_cart(session_id)
        return jsonify({'message': 'Cart cleared successfully'}), 204
    except Exception as e:
        return jsonify({'error': str(e)}), 400
