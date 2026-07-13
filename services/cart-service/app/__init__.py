from flask import Flask, jsonify
from prometheus_flask_exporter import PrometheusMetrics
from app.config import Config
from app.extensions import db, migrate, ma
from app.routes.cart import cart_bp
import logging

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)


    metrics = PrometheusMetrics(app)
    metrics.info('app_info', 'Service info', service='cart-service')
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # Register blueprints
    app.register_blueprint(cart_bp, url_prefix='/api')

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'service': 'cart-service'}), 200

    # Error handling
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad Request", "message": str(error)}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not Found", "message": str(error)}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({"error": "Internal Server Error"}), 500

    return app
