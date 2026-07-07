from flask import Flask
from prometheus_flask_exporter import PrometheusMetrics
from app.config import Config
from app.extensions import db, migrate, ma

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)


    metrics = PrometheusMetrics(app)
    metrics.info('app_info', 'Service info', service='product-service')
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    from app.controllers.product_controller import product_bp
    from app.controllers.category_controller import category_bp

    app.register_blueprint(product_bp)
    app.register_blueprint(category_bp)

    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy'}, 200

    return app
