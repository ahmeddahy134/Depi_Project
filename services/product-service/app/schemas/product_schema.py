from app.extensions import ma
from app.models.product import Product

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True
        include_fk = True

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
