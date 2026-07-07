import os
import requests
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

metrics = PrometheusMetrics(app)
metrics.info('app_info', 'Service info', service='api-gateway')

# Service mapping and configuration (Section 2.1 of the handbook)
SERVICES = {
    'product': os.environ.get('PRODUCT_SERVICE_URL', 'http://localhost:5001'),
    'cart': os.environ.get('CART_SERVICE_URL', 'http://localhost:5002'),
    'inventory': os.environ.get('INVENTORY_SERVICE_URL', 'http://localhost:5003'),
    'order': os.environ.get('ORDER_SERVICE_URL', 'http://localhost:5004'),
    'notification': os.environ.get('NOTIFICATION_SERVICE_URL', 'http://localhost:5005'),
}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for the API Gateway."""
    return jsonify({'status': 'healthy', 'service': 'api-gateway'}), 200

@app.route('/<service_name>', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
@app.route('/<service_name>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
def proxy(service_name, path):
    """
    Proxy requests to the appropriate microservice.
    Supports both `/<service>/...` and `/api/<service>/...` URL patterns.
    """
    actual_service = service_name
    forward_path = path

    # Handle optional /api/ prefix transparently
    if service_name == 'api':
        if not path:
            return jsonify({'error': 'Service not specified'}), 400
        parts = path.split('/', 1)
        actual_service = parts[0]
        forward_path = parts[1] if len(parts) > 1 else ''

    # Verify service exists
    if actual_service not in SERVICES:
        return jsonify({'error': f'Service \'{actual_service}\' not found'}), 404

    # Construct target URL
    url = f"{SERVICES[actual_service]}/{forward_path}"
    
    # Maintain trailing slash if present in original request
    if request.path.endswith('/') and not url.endswith('/'):
        url += '/'

    try:
        # Forward headers, excluding 'Host' to avoid domain mismatches
        headers = {key: value for key, value in request.headers if key.lower() != 'host'}
        
        # Proxy the request
        response = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            data=request.get_data(),
            cookies=request.cookies,
            params=request.args,
            allow_redirects=False
        )
        
        # Filter response headers
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        forward_headers = [
            (name, value) for name, value in response.raw.headers.items()
            if name.lower() not in excluded_headers
        ]
                   
        return Response(response.content, response.status_code, forward_headers)

    except requests.exceptions.ConnectionError:
        return jsonify({
            'error': 'Service unavailable', 
            'details': f'Could not connect to {actual_service} service'
        }), 503
    except requests.exceptions.Timeout:
        return jsonify({
            'error': 'Gateway timeout', 
            'details': f'Request to {actual_service} service timed out'
        }), 504
    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': 'Failed to connect to backend service', 
            'details': str(e)
        }), 502
    except Exception as e:
        return jsonify({
            'error': 'Internal server error', 
            'details': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
