from app.models.product import Product

class ProductRepository:
    @staticmethod
    def get_all(page, per_page, category_id=None, brand=None, sort_by=None):
        query = Product.query
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        if brand:
            query = query.filter_by(brand=brand)
            
        if sort_by == 'price_asc':
            query = query.order_by(Product.price.asc())
        elif sort_by == 'price_desc':
            query = query.order_by(Product.price.desc())
        elif sort_by == 'newest':
            query = query.order_by(Product.created_at.desc())
        else:
            query = query.order_by(Product.created_at.desc())
            
        return query.paginate(page=page, per_page=per_page, error_out=False)
        
    @staticmethod
    def get_featured():
        return Product.query.filter_by(is_featured=True).all()
        
    @staticmethod
    def search(q):
        return Product.query.filter(Product.name.ilike(f'%{q}%') | Product.description.ilike(f'%{q}%')).all()
        
    @staticmethod
    def get_by_id(product_id):
        return Product.query.get(product_id)
        
    @staticmethod
    def get_by_category(category_id):
        return Product.query.filter_by(category_id=category_id).all()
