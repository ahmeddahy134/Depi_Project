from app.repositories.category_repository import CategoryRepository

class CategoryService:
    @staticmethod
    def get_all_categories():
        return CategoryRepository.get_all()
        
    @staticmethod
    def get_category_by_id(category_id):
        return CategoryRepository.get_by_id(category_id)
