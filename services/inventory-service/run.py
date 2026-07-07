import os
from app import create_app

env = os.environ.get('FLASK_ENV', 'development')
app = create_app(env)

if __name__ == '__main__':
    port = int(os.environ.get('FLASK_RUN_PORT', 5003))
    app.run(host='0.0.0.0', port=port)
