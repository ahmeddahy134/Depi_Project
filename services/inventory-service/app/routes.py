from flask import Blueprint, request, jsonify
from app.services import InventoryService
from app.schemas import inventory_schema, inventories_schema
from marshmallow import ValidationError

inventory_bp = Blueprint('inventory_bp', __name__, url_prefix='/api/inventory')
inventory_service = InventoryService()

@inventory_bp.route('/<string:product_id>', methods=['GET'])
def get_inventory(product_id):
    if product_id == 'check':
        return check_inventory()
        
    inventory = inventory_service.get_inventory(product_id)
    if not inventory:
        return jsonify({'message': 'Inventory not found'}), 404
    return jsonify(inventory_schema.dump(inventory)), 200

@inventory_bp.route('/check', methods=['GET'])
def check_inventory():
    product_ids_str = request.args.get('product_ids', '')
    if not product_ids_str:
        return jsonify({'message': 'product_ids query parameter is required'}), 400
    
    product_ids = [pid.strip() for pid in product_ids_str.split(',') if pid.strip()]
    inventories = inventory_service.check_inventories(product_ids)
    return jsonify(inventories_schema.dump(inventories)), 200

@inventory_bp.route('/<string:product_id>', methods=['PUT'])
def update_inventory(product_id):
    data = request.get_json()
    stock = data.get('stock')
    reorder_level = data.get('reorder_level')
    
    if stock is None:
        return jsonify({'message': 'stock is required'}), 400
        
    inventory = inventory_service.create_or_update_inventory(product_id, stock, reorder_level)
    return jsonify(inventory_schema.dump(inventory)), 200

@inventory_bp.route('/<string:product_id>/reserve', methods=['PUT'])
def reserve_inventory(product_id):
    data = request.get_json()
    quantity = data.get('quantity')
    
    if quantity is None or quantity <= 0:
        return jsonify({'message': 'Valid quantity is required'}), 400
        
    try:
        inventory = inventory_service.reserve_stock(product_id, quantity)
        return jsonify(inventory_schema.dump(inventory)), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

@inventory_bp.route('/<string:product_id>/release', methods=['PUT'])
def release_inventory(product_id):
    data = request.get_json()
    quantity = data.get('quantity')
    
    if quantity is None or quantity <= 0:
        return jsonify({'message': 'Valid quantity is required'}), 400
        
    try:
        inventory = inventory_service.release_stock(product_id, quantity)
        return jsonify(inventory_schema.dump(inventory)), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
