from app.extensions import ma
from app.models import Inventory

class InventorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Inventory
        load_instance = True
    
    available = ma.Integer(dump_only=True)

inventory_schema = InventorySchema()
inventories_schema = InventorySchema(many=True)
