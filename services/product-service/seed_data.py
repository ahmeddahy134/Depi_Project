from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.product import Product

app = create_app()

with app.app_context():
    db.create_all()

    # Clear existing
    Product.query.delete()
    Category.query.delete()

    categories = [
        Category(id=1, name='Electronics', description='Gadgets and devices', icon='laptop', image_url='cat_electronics.jpg'),
        Category(id=2, name='Clothing', description='Apparel and fashion', icon='shirt', image_url='cat_clothing.jpg'),
        Category(id=3, name='Home & Garden', description='Furniture and decor', icon='home', image_url='cat_home.jpg')
    ]

    db.session.add_all(categories)
    db.session.commit()

    products = [
        Product(id='PROD-001', name='Smartphone X', description='Latest smartphone', price=999.99, stock=50, category_id=1, brand='TechBrand', rating=4.5, review_count=120, badge='New', discount_percentage=0, is_featured=True),
        Product(id='PROD-002', name='Laptop Pro', description='High performance laptop', price=1999.99, stock=30, category_id=1, brand='TechBrand', rating=4.8, review_count=85, badge='', discount_percentage=10, is_featured=True),
        Product(id='PROD-003', name='Wireless Earbuds', description='Noise cancelling earbuds', price=149.99, stock=100, category_id=1, brand='AudioTech', rating=4.2, review_count=200, badge='Best Seller', discount_percentage=5, is_featured=False),
        Product(id='PROD-004', name='Smartwatch Series 5', description='Health tracking smartwatch', price=299.99, stock=60, category_id=1, brand='TechBrand', rating=4.6, review_count=150, badge='', discount_percentage=0, is_featured=False),
        Product(id='PROD-005', name='Cotton T-Shirt', description='100% cotton casual t-shirt', price=19.99, stock=200, category_id=2, brand='FashionCo', rating=4.0, review_count=50, badge='', discount_percentage=0, is_featured=False),
        Product(id='PROD-006', name='Denim Jeans', description='Classic fit denim jeans', price=49.99, stock=150, category_id=2, brand='DenimWorks', rating=4.3, review_count=75, badge='', discount_percentage=15, is_featured=False),
        Product(id='PROD-007', name='Winter Jacket', description='Warm winter jacket', price=89.99, stock=80, category_id=2, brand='OuterWear', rating=4.7, review_count=40, badge='Sale', discount_percentage=20, is_featured=True),
        Product(id='PROD-008', name='Running Shoes', description='Comfortable running shoes', price=129.99, stock=90, category_id=2, brand='SportFoot', rating=4.5, review_count=110, badge='', discount_percentage=0, is_featured=False),
        Product(id='PROD-009', name='Coffee Maker', description='Programmable coffee maker', price=79.99, stock=40, category_id=3, brand='HomeBrew', rating=4.4, review_count=95, badge='', discount_percentage=10, is_featured=True),
        Product(id='PROD-010', name='Blender', description='High speed blender', price=59.99, stock=60, category_id=3, brand='KitchenMaster', rating=4.1, review_count=65, badge='', discount_percentage=0, is_featured=False),
        Product(id='PROD-011', name='Desk Lamp', description='LED desk lamp with USB port', price=29.99, stock=120, category_id=3, brand='LightTech', rating=4.6, review_count=180, badge='Best Seller', discount_percentage=0, is_featured=False),
        Product(id='PROD-012', name='Office Chair', description='Ergonomic office chair', price=199.99, stock=25, category_id=3, brand='OfficeComfort', rating=4.8, review_count=210, badge='', discount_percentage=5, is_featured=True)
    ]

    db.session.add_all(products)
    db.session.commit()

    print("Database seeded with 3 categories and 12 products.")
