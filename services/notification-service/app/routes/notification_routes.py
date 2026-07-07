from flask import Blueprint, request, jsonify
from app.services.notification_service import NotificationService
from app.schemas.notification_schema import NotificationSchema
from app.schemas.email_log_schema import EmailLogSchema

bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')
notification_service = NotificationService()
notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)
email_log_schema = EmailLogSchema()

@bp.route('', methods=['GET'])
def get_notifications():
    session_id = request.args.get('session_id')
    notifications = notification_service.get_notifications(session_id)
    return jsonify(notifications_schema.dump(notifications)), 200

@bp.route('', methods=['POST'])
def create_notification():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400
    
    required_fields = ['session_id', 'type', 'title', 'message']
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing field {field}"}), 400
            
    notification = notification_service.create_notification(data)
    return jsonify(notification_schema.dump(notification)), 201

@bp.route('/<int:id>/read', methods=['PUT'])
def mark_notification_read(id):
    notification = notification_service.mark_as_read(id)
    if not notification:
        return jsonify({"message": "Notification not found"}), 404
    return jsonify(notification_schema.dump(notification)), 200

@bp.route('/email', methods=['POST'])
def send_email():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400
        
    required_fields = ['to_email', 'subject', 'body']
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing field {field}"}), 400
            
    email_log = notification_service.send_email(data)
    return jsonify(email_log_schema.dump(email_log)), 201
