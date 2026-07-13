from app.extensions import ma
from app.models.notification import Notification

class NotificationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Notification
        load_instance = True
