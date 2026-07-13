from flask import Flask, jsonify
from prometheus_flask_exporter import PrometheusMetrics
from config import config_by_name
from app.extensions import db, migrate, ma

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # Enable Prometheus metrics
    PrometheusMetrics(app)

    from app.routes import inventory_bp
    app.register_blueprint(inventory_bp)

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'inventory-service'
        }), 200

    return app
