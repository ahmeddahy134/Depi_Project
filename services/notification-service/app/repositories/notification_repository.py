from app.models.notification import Notification
from app.extensions import db

class NotificationRepository:
    def get_all(self, session_id=None):
        query = Notification.query
        if session_id:
            query = query.filter_by(session_id=session_id)
        return query.order_by(Notification.created_at.desc()).all()

    def get_by_id(self, notification_id):
        return Notification.query.get(notification_id)

    def save(self, notification):
        db.session.add(notification)
        db.session.commit()
        return notification
