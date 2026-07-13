def test_get_categories(client, init_database):
    response = client.get('/api/categories')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['name'] == 'Test Category'

def test_get_category_by_id(client, init_database):
    response = client.get('/api/categories/1')
    assert response.status_code == 200
    data = response.get_json()
    assert data['id'] == 1

def test_get_category_products(client, init_database):
    response = client.get('/api/categories/1/products')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 2
