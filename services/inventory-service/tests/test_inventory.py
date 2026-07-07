import json

def test_get_inventory(client, init_database):
    response = client.get('/api/inventory/P1')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['product_id'] == 'P1'
    assert data['stock'] == 100
    assert data['available'] == 90

def test_get_inventory_not_found(client):
    response = client.get('/api/inventory/NON_EXISTENT')
    assert response.status_code == 404

def test_check_inventory(client, init_database):
    response = client.get('/api/inventory/check?product_ids=P1,P2,P3')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    product_ids = [item['product_id'] for item in data]
    assert 'P1' in product_ids
    assert 'P2' in product_ids

def test_update_inventory(client):
    response = client.put('/api/inventory/P3', json={'stock': 200, 'reorder_level': 20})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['product_id'] == 'P3'
    assert data['stock'] == 200
    assert data['reorder_level'] == 20

def test_reserve_inventory(client, init_database):
    response = client.put('/api/inventory/P1/reserve', json={'quantity': 50})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['reserved'] == 60
    assert data['available'] == 40

def test_reserve_inventory_insufficient_stock(client, init_database):
    response = client.put('/api/inventory/P1/reserve', json={'quantity': 100})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'Insufficient stock' in data['message']

def test_release_inventory(client, init_database):
    response = client.put('/api/inventory/P1/release', json={'quantity': 5})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['reserved'] == 5
    assert data['available'] == 95

def test_release_inventory_too_much(client, init_database):
    response = client.put('/api/inventory/P1/release', json={'quantity': 20})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'Cannot release more than reserved' in data['message']
