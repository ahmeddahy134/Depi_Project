import json

def test_create_notification(client):
    data = {
        "session_id": "session_123",
        "type": "alert",
        "title": "Test Title",
        "message": "Test Message"
    }
    response = client.post('/api/notifications', json=data)
    assert response.status_code == 201
    assert response.json['title'] == "Test Title"
    assert response.json['is_read'] == False

def test_get_notifications(client):
    data = {
        "session_id": "session_123",
        "type": "alert",
        "title": "Test Title",
        "message": "Test Message"
    }
    client.post('/api/notifications', json=data)
    
    response = client.get('/api/notifications')
    assert response.status_code == 200
    assert len(response.json) >= 1

def test_mark_as_read(client):
    data = {
        "session_id": "session_123",
        "type": "alert",
        "title": "Test Title",
        "message": "Test Message"
    }
    create_response = client.post('/api/notifications', json=data)
    notification_id = create_response.json['id']
    
    response = client.put(f'/api/notifications/{notification_id}/read')
    assert response.status_code == 200
    assert response.json['is_read'] == True

def test_send_email(client):
    data = {
        "to_email": "user@example.com",
        "subject": "Welcome",
        "body": "Hello user"
    }
    response = client.post('/api/notifications/email', json=data)
    assert response.status_code == 201
    assert response.json['status'] == 'sent'
