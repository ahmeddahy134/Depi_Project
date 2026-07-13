"""
Seeds the product-service database with the GlowCare skincare catalog,
matching the categories/products shown in the frontend demo data
(src/data/products.js) so the real backend and the UI agree from day one.

Run inside the product-service container/venv:
    python seed_glowcare.py
"""
from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.product import Product

app = create_app()

with app.app_context():
    db.create_all()

    # Clear existing data so this script is safely re-runnable.
    Product.query.delete()
    Category.query.delete()

    categories = [
        Category(id=1, name='سيروم', description='عناية مركزة لبشرة مشرقة', icon='droplet', image_url=''),
        Category(id=2, name='كريمات', description='ترطيب عميق ونعومة تدوم', icon='cream', image_url=''),
        Category(id=3, name='غسول ومنظفات', description='تنظيف لطيف وفعال', icon='soap', image_url=''),
        Category(id=4, name='تونر وماء الورد', description='انتعاش وتوازن مسام البشرة', icon='spray', image_url=''),
        Category(id=5, name='واقي شمس', description='حماية مثالية من الأشعة', icon='sun', image_url=''),
        Category(id=6, name='مقشرات', description='تجديد خلايا البشرة بفعالية', icon='sparkles', image_url=''),
        Category(id=7, name='اقنعة وماسكات', description='تغذية مكثفة واسترخاء', icon='mask', image_url=''),
    ]
    db.session.add_all(categories)
    db.session.commit()

    products = [
        Product(
            id='GC-001', name='سيروم النضارة الفائق',
            description='سيروم غني بفيتامين سي وحمض الهيالورونيك لنضارة وتفتيح البشرة بشكل ملحوظ من أول استخدام.',
            price=250, stock=80, category_id=1,
            image='https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            brand='GlowCare', rating=4.8, review_count=142, badge='الأكثر مبيعاً',
            discount_percentage=0, is_featured=True,
        ),
        Product(
            id='GC-002', name='كريم الترطيب العميق',
            description='كريم غني بالزبدة الطبيعية لترطيب عميق يدوم 48 ساعة ويحمي من الجفاف.',
            price=180, stock=100, category_id=2,
            image='https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            brand='GlowCare', rating=4.6, review_count=98, badge='',
            discount_percentage=0, is_featured=True,
        ),
        Product(
            id='GC-003', name='غسول الوجه اللطيف',
            description='غسول يومي ينظف بلطف ويزيل الشوائب دون تجريد البشرة من زيوتها الطبيعية.',
            price=120, stock=150, category_id=3,
            image='https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            brand='GlowCare', rating=4.4, review_count=76, badge='',
            discount_percentage=0, is_featured=True,
        ),
        Product(
            id='GC-004', name='تونر ماء الورد النقي',
            description='تونر منعش يعيد توازن مسام البشرة ويجهزها لخطوات العناية التالية.',
            price=95, stock=120, category_id=4,
            image='https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            brand='GlowCare', rating=4.5, review_count=61, badge='',
            discount_percentage=0, is_featured=False,
        ),
        Product(
            id='GC-005', name='واقي شمس يومي SPF 50',
            description='حماية فائقة SPF 50 بدون أي لمعان او ملمس دهني.',
            price=190, stock=70, category_id=5,
            image='https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            brand='GlowCare', rating=4.7, review_count=54, badge='جديد',
            discount_percentage=0, is_featured=False,
        ),
        Product(
            id='GC-006', name='مقشر الوجه اللطيف',
            description='مقشر لطيف يزيل خلايا الجلد الميتة ويكشف عن بشرة ناعمة ومتجددة.',
            price=135, stock=60, category_id=6,
            image='https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            brand='GlowCare', rating=4.3, review_count=39, badge='',
            discount_percentage=10, is_featured=False,
        ),
        Product(
            id='GC-007', name='ماسك الطين المنقي',
            description='ينظف المسام بعمق ويزيل الرؤوس السوداء دون تجفيف البشرة.',
            price=140, stock=90, category_id=7,
            image='https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            brand='GlowCare', rating=4.6, review_count=88, badge='',
            discount_percentage=0, is_featured=True,
        ),
    ]
    db.session.add_all(products)
    db.session.commit()

    print(f"Seeded {len(categories)} categories and {len(products)} GlowCare products.")
