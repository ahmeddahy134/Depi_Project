from app.models.category import Category

class CategoryRepository:
    @staticmethod
    def get_all():
        return Category.query.all()
    
    @staticmethod
    def get_by_id(category_id):
        return Category.query.get(category_id)
