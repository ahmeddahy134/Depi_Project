import json

def test_get_empty_cart(client, headers):
    response = client.get('/api/cart', headers=headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'items' in data
    assert len(data['items']) == 0

def test_add_item_to_cart(client, headers):
    payload = {
        'product_id': 'P001',
        'product_name': 'Test Product',
        'product_price': 10.99,
        'quantity': 2
    }
    response = client.post('/api/cart/items', headers=headers, json=payload)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['product_id'] == 'P001'
    assert data['quantity'] == 2

    # Verify cart has 1 item
    cart_res = client.get('/api/cart', headers=headers)
    cart_data = json.loads(cart_res.data)
    assert len(cart_data['items']) == 1

def test_update_item_quantity(client, headers):
    # Add item
    payload = {
        'product_id': 'P002',
        'product_name': 'Another Product',
        'product_price': 20.0,
        'quantity': 1
    }
    add_res = client.post('/api/cart/items', headers=headers, json=payload)
    item_id = json.loads(add_res.data)['id']

    # Update item
    update_res = client.put(f'/api/cart/items/{item_id}', headers=headers, json={'quantity': 5})
    assert update_res.status_code == 200
    data = json.loads(update_res.data)
    assert data['quantity'] == 5

def test_remove_item(client, headers):
    # Add item
    payload = {
        'product_id': 'P003',
        'product_name': 'Remove Me',
        'product_price': 5.0,
        'quantity': 1
    }
    add_res = client.post('/api/cart/items', headers=headers, json=payload)
    item_id = json.loads(add_res.data)['id']

    # Remove item
    del_res = client.delete(f'/api/cart/items/{item_id}', headers=headers)
    assert del_res.status_code == 204

    # Verify empty cart
    cart_res = client.get('/api/cart', headers=headers)
    assert len(json.loads(cart_res.data)['items']) == 0

def test_clear_cart(client, headers):
    # Add item
    payload = {'product_id': 'P004', 'product_name': 'Clear Me', 'product_price': 1.0, 'quantity': 1}
    client.post('/api/cart/items', headers=headers, json=payload)

    # Clear cart
    del_res = client.delete('/api/cart', headers=headers)
    assert del_res.status_code == 204

    # Verify empty cart
    cart_res = client.get('/api/cart', headers=headers)
    assert len(json.loads(cart_res.data)['items']) == 0

def test_missing_session_id(client):
    response = client.get('/api/cart')
    assert response.status_code == 400
