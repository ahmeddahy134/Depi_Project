import json

def test_create_order(client, session_headers):
    data = {
        "shipping_address": "123 Main St",
        "phone": "555-1234",
        "payment_method": "credit_card",
        "items": [
            {
                "product_id": "P001",
                "product_name": "Test Product",
                "quantity": 2,
                "unit_price": 50.0
            }
        ]
    }
    response = client.post('/api/orders', headers=session_headers, json=data)
    assert response.status_code == 201
    
    res_data = response.get_json()
    assert res_data['shipping_address'] == "123 Main St"
    assert res_data['total_amount'] == 100.0
    assert len(res_data['items']) == 1
    assert res_data['items'][0]['total_price'] == 100.0

def test_get_orders(client, session_headers):
    data = {
        "shipping_address": "123 Main St",
        "phone": "555-1234",
        "payment_method": "credit_card",
        "items": [
            {"product_id": "P001", "product_name": "Test", "quantity": 1, "unit_price": 10.0}
        ]
    }
    client.post('/api/orders', headers=session_headers, json=data)
    
    response = client.get('/api/orders', headers=session_headers)
    assert response.status_code == 200
    res_data = response.get_json()
    assert len(res_data) == 1
    assert res_data[0]['total_amount'] == 10.0

def test_get_order_by_id(client, session_headers):
    data = {
        "shipping_address": "123 Main St",
        "phone": "555-1234",
        "payment_method": "credit_card",
        "items": [
            {"product_id": "P001", "product_name": "Test", "quantity": 1, "unit_price": 10.0}
        ]
    }
    create_res = client.post('/api/orders', headers=session_headers, json=data)
    order_id = create_res.get_json()['id']
    
    response = client.get(f'/api/orders/{order_id}', headers=session_headers)
    assert response.status_code == 200
    assert response.get_json()['id'] == order_id

def test_cancel_order(client, session_headers):
    data = {
        "shipping_address": "123 Main St",
        "phone": "555-1234",
        "payment_method": "credit_card",
        "items": [
            {"product_id": "P001", "product_name": "Test", "quantity": 1, "unit_price": 10.0}
        ]
    }
    create_res = client.post('/api/orders', headers=session_headers, json=data)
    order_id = create_res.get_json()['id']
    
    response = client.put(f'/api/orders/{order_id}/cancel', headers=session_headers)
    assert response.status_code == 200
    assert response.get_json()['status'] == 'cancelled'

def test_missing_session_header(client):
    response = client.get('/api/orders')
    assert response.status_code == 401
    assert 'error' in response.get_json()
