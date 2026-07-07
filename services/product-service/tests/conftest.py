import pytest
from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.product import Product

@pytest.fixture
def app():
    class TestConfig:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        TESTING = True

    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def init_database(app):
    with app.app_context():
        category = Category(id=1, name='Test Category')
        db.session.add(category)
        db.session.commit()
        
        product1 = Product(id='T1', name='Product 1', price=10.0, category_id=1, is_featured=True)
        product2 = Product(id='T2', name='Product 2', price=20.0, category_id=1, is_featured=False)
        db.session.add_all([product1, product2])
        db.session.commit()
