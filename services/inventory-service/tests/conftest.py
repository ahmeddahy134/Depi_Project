import pytest
from app import create_app
from app.extensions import db

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def init_database(app):
    from app.models import Inventory
    from datetime import datetime, timezone
    
    inv1 = Inventory(product_id='P1', stock=100, reserved=10, last_restocked=datetime.now(timezone.utc))
    inv2 = Inventory(product_id='P2', stock=50, reserved=0, last_restocked=datetime.now(timezone.utc))
    
    db.session.add_all([inv1, inv2])
    db.session.commit()
    
    return [inv1, inv2]
