import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import db
from routes.admin import admin_bp

if os.path.exists('secret.env'):
    load_dotenv('secret.env')

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me-in-production")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 280,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)
db.init_app(app)

@app.route('/health')
def health():
    try:
        db.session.execute(db.text('SELECT 1'))
        return jsonify({"status": "healthy", "service": "admin"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

app.register_blueprint(admin_bp)

if __name__ == '__main__':
    app.run(debug=False, port=5010, host='0.0.0.0')
