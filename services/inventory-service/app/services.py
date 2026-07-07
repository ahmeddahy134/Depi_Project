from app.repositories import InventoryRepository
from app.models import Inventory
from datetime import datetime, timezone

class InventoryService:
    def __init__(self):
        self.repository = InventoryRepository()

    def get_inventory(self, product_id):
        return self.repository.get_by_product_id(product_id)
    
    def check_inventories(self, product_ids):
        return self.repository.get_by_product_ids(product_ids)

    def create_or_update_inventory(self, product_id, stock, reorder_level=None):
        inventory = self.repository.get_by_product_id(product_id)
        if inventory:
            inventory.stock = stock
            if reorder_level is not None:
                inventory.reorder_level = reorder_level
            inventory.last_restocked = datetime.now(timezone.utc)
            return self.repository.update(inventory)
        else:
            inventory = Inventory(
                product_id=product_id, 
                stock=stock, 
                reorder_level=reorder_level if reorder_level is not None else 10,
                last_restocked=datetime.now(timezone.utc)
            )
            return self.repository.create(inventory)

    def reserve_stock(self, product_id, quantity):
        inventory = self.repository.get_by_product_id(product_id)
        if not inventory:
            raise ValueError(f"Inventory for product {product_id} not found")
        
        if inventory.available < quantity:
            raise ValueError(f"Insufficient stock for product {product_id}. Available: {inventory.available}")
        
        inventory.reserved += quantity
        return self.repository.update(inventory)

    def release_stock(self, product_id, quantity):
        inventory = self.repository.get_by_product_id(product_id)
        if not inventory:
            raise ValueError(f"Inventory for product {product_id} not found")
        
        if inventory.reserved < quantity:
            raise ValueError(f"Cannot release more than reserved for product {product_id}")
        
        inventory.reserved -= quantity
        return self.repository.update(inventory)
