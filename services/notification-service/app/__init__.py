from flask import Flask, jsonify
from prometheus_flask_exporter import PrometheusMetrics
from app.config import Config
from app.extensions import db, migrate, ma

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)


    metrics = PrometheusMetrics(app)
    metrics.info('app_info', 'Service info', service='notification-service')
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # Register blueprints
    from app.routes.notification_routes import bp as notification_bp
    app.register_blueprint(notification_bp)

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'service': 'notification-service'}), 200

    return app
