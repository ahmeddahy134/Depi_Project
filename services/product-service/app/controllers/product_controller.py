from flask import Blueprint, jsonify, request
from app.services.product_service import ProductService
from app.schemas.product_schema import product_schema, products_schema

product_bp = Blueprint('product', __name__, url_prefix='/api/products')

@product_bp.route('', methods=['GET'])
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    category_id = request.args.get('category_id', type=int)
    brand = request.args.get('brand')
    sort_by = request.args.get('sort_by')
    
    pagination = ProductService.get_all_products(page, per_page, category_id, brand, sort_by)
    products = pagination.items
    
    return jsonify({
        'products': products_schema.dump(products),
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page
    }), 200

@product_bp.route('/featured', methods=['GET'])
def get_featured_products():
    products = ProductService.get_featured_products()
    return jsonify(products_schema.dump(products)), 200

@product_bp.route('/search', methods=['GET'])
def search_products():
    q = request.args.get('q', '')
    if not q:
        return jsonify([]), 200
    products = ProductService.search_products(q)
    return jsonify(products_schema.dump(products)), 200

@product_bp.route('/<string:id>', methods=['GET'])
def get_product(id):
    product = ProductService.get_product_by_id(id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(product_schema.dump(product)), 200
