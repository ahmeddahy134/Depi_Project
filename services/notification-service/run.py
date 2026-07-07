from app import create_app
from app.extensions import db
from app.models import Notification, EmailLog

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Notification': Notification, 'EmailLog': EmailLog}

if __name__ == '__main__':
    app.run(port=5005)
