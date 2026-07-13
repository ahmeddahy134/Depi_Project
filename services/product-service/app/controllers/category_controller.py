from flask import Blueprint, jsonify
from app.services.category_service import CategoryService
from app.schemas.category_schema import category_schema, categories_schema
from app.services.product_service import ProductService
from app.schemas.product_schema import products_schema

category_bp = Blueprint('category', __name__, url_prefix='/api/categories')

@category_bp.route('', methods=['GET'])
def get_categories():
    categories = CategoryService.get_all_categories()
    return jsonify(categories_schema.dump(categories)), 200

@category_bp.route('/<int:id>', methods=['GET'])
def get_category(id):
    category = CategoryService.get_category_by_id(id)
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    return jsonify(category_schema.dump(category)), 200

@category_bp.route('/<int:id>/products', methods=['GET'])
def get_category_products(id):
    products = ProductService.get_products_by_category(id)
    return jsonify(products_schema.dump(products)), 200
