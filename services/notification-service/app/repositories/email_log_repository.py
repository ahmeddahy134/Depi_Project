from app.models.email_log import EmailLog
from app.extensions import db

class EmailLogRepository:
    def save(self, email_log):
        db.session.add(email_log)
        db.session.commit()
        return email_log
