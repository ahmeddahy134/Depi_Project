from app.extensions import ma
from app.models.email_log import EmailLog

class EmailLogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EmailLog
        load_instance = True
