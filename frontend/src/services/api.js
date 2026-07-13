// Central place for talking to the TechnoZone/GlowCare backend microservices
// via the API Gateway. All requests go through the gateway so the frontend
// never needs to know individual service hostnames/ports.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Every visitor gets a persistent session id (no login required) so the
// backend cart/order services can associate carts & orders with them.
function getSessionId() {
  let sessionId = localStorage.getItem('glowcare_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('glowcare_session_id', sessionId);
  }
  return sessionId;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': getSessionId(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let body;
    try { body = await res.json(); } catch { body = null; }
    const message = body?.error || body?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ---- Products ----
// NOTE: the gateway maps /<service>/<path> -> that service's own routes.
// product-service's own routes already live under /api/products & /api/categories,
// so calls must go through the gateway as /product/api/products, etc.
export async function fetchProducts({ page = 1, perPage = 50 } = {}) {
  const data = await request(`/product/api/products?page=${page}&per_page=${perPage}`);
  return data.products || [];
}

export async function fetchProduct(id) {
  return request(`/product/api/products/${id}`);
}

export async function fetchCategories() {
  return request('/product/api/categories');
}

// ---- Cart ----
// cart-service's own routes live under /api/cart, so via the gateway: /cart/api/cart
export async function getCart() {
  return request('/cart/api/cart');
}

export async function addCartItem({ productId, name, price, image, quantity = 1 }) {
  return request('/cart/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({
      product_id: String(productId),
      product_name: name,
      product_price: price,
      product_image: image,
      quantity,
    }),
  });
}

export async function updateCartItem(itemId, quantity) {
  return request(`/cart/api/cart/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(itemId) {
  return request(`/cart/api/cart/items/${itemId}`, { method: 'DELETE' });
}

export async function clearBackendCart() {
  return request('/cart/api/cart', { method: 'DELETE' });
}

// ---- Orders ----
// order-service's own routes live under /api/orders, so via the gateway: /order/api/orders
export async function createOrder({ items, shippingAddress, phone, paymentMethod }) {
  return request('/order/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      shipping_address: shippingAddress,
      phone,
      payment_method: paymentMethod,
      items: items.map((item) => ({
        product_id: String(item.id),
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
    }),
  });
}

export async function fetchOrders() {
  return request('/order/api/orders');
}

export { getSessionId, API_BASE_URL };
