from flask import Flask, jsonify
from prometheus_flask_exporter import PrometheusMetrics
from .config import Config
from .extensions import db, migrate
from .models import Order, OrderItem
from .routes.order_routes import order_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)


    metrics = PrometheusMetrics(app)
    metrics.info('app_info', 'Service info', service='order-service')
    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(order_bp, url_prefix='/api')

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'service': 'order-service'}), 200

    return app
