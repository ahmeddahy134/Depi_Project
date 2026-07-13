def test_get_products(client, init_database):
    response = client.get('/api/products')
    assert response.status_code == 200
    data = response.get_json()
    assert 'products' in data
    assert len(data['products']) == 2

def test_get_featured_products(client, init_database):
    response = client.get('/api/products/featured')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['id'] == 'T1'

def test_search_products(client, init_database):
    response = client.get('/api/products/search?q=Product 1')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['name'] == 'Product 1'

def test_get_product_by_id(client, init_database):
    response = client.get('/api/products/T1')
    assert response.status_code == 200
    data = response.get_json()
    assert data['id'] == 'T1'
    
def test_get_product_by_id_not_found(client, init_database):
    response = client.get('/api/products/T999')
    assert response.status_code == 404
