from app.repositories.product_repository import ProductRepository

class ProductService:
    @staticmethod
    def get_all_products(page=1, per_page=10, category_id=None, brand=None, sort_by=None):
        return ProductRepository.get_all(page, per_page, category_id, brand, sort_by)
        
    @staticmethod
    def get_featured_products():
        return ProductRepository.get_featured()
        
    @staticmethod
    def search_products(q):
        return ProductRepository.search(q)
        
    @staticmethod
    def get_product_by_id(product_id):
        return ProductRepository.get_by_id(product_id)
        
    @staticmethod
    def get_products_by_category(category_id):
        return ProductRepository.get_by_category(category_id)
