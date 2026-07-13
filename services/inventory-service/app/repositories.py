from app.models import Inventory
from app.extensions import db

class InventoryRepository:
    def get_by_product_id(self, product_id):
        return Inventory.query.filter_by(product_id=product_id).first()

    def get_by_product_ids(self, product_ids):
        return Inventory.query.filter(Inventory.product_id.in_(product_ids)).all()

    def create(self, inventory):
        db.session.add(inventory)
        db.session.commit()
        return inventory

    def update(self, inventory):
        db.session.commit()
        return inventory
    
    def delete(self, inventory):
        db.session.delete(inventory)
        db.session.commit()
