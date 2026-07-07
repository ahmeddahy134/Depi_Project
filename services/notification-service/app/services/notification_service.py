from app.repositories.notification_repository import NotificationRepository
from app.repositories.email_log_repository import EmailLogRepository
from app.models.notification import Notification
from app.models.email_log import EmailLog

class NotificationService:
    def __init__(self):
        self.notification_repo = NotificationRepository()
        self.email_log_repo = EmailLogRepository()

    def get_notifications(self, session_id=None):
        return self.notification_repo.get_all(session_id)

    def create_notification(self, data):
        notification = Notification(
            session_id=data.get('session_id'),
            type=data.get('type'),
            title=data.get('title'),
            message=data.get('message'),
            is_read=False
        )
        return self.notification_repo.save(notification)

    def mark_as_read(self, notification_id):
        notification = self.notification_repo.get_by_id(notification_id)
        if not notification:
            return None
        notification.is_read = True
        return self.notification_repo.save(notification)

    def send_email(self, data):
        # Mock send email
        email_log = EmailLog(
            to_email=data.get('to_email'),
            subject=data.get('subject'),
            body=data.get('body'),
            status='sent'
        )
        return self.email_log_repo.save(email_log)
