from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from sqlalchemy import text, func
from models import db, User, Product, Category, Order, OrderItem, Coupon, Newsletter, ContactMessage
from werkzeug.security import generate_password_hash
import uuid

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


def admin_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('admin_id'):
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated


# ─── Login ──────────────────────────────────────────────────
@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if session.get('admin_id'):
        return redirect(url_for('admin.dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

        user = User.query.filter_by(email=email, is_admin=True).first()
        if not user:
            flash('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error')
            return render_template('admin/login.html')

        from werkzeug.security import check_password_hash
        if not check_password_hash(user.password_hash, password):
            flash('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error')
            return render_template('admin/login.html')

        session['admin_id'] = user.id
        session['admin_name'] = user.name
        return redirect(url_for('admin.dashboard'))

    return render_template('admin/login.html')


@admin_bp.route('/logout')
def logout():
    session.pop('admin_id', None)
    session.pop('admin_name', None)
    return redirect(url_for('admin.login'))


# ─── Dashboard ──────────────────────────────────────────────
@admin_bp.route('/')
@admin_bp.route('/dashboard')
@admin_required
def dashboard():
    stats = {
        'users': User.query.filter_by(is_admin=False).count(),
        'products': Product.query.count(),
        'orders': Order.query.count(),
        'revenue': db.session.query(func.sum(Order.total)).filter(Order.status == 'completed').scalar() or 0,
        'pending_orders': Order.query.filter_by(status='pending').count(),
        'categories': Category.query.count(),
        'coupons': Coupon.query.filter_by(is_active=True).count(),
        'newsletters': Newsletter.query.count(),
        'messages': ContactMessage.query.count(),
    }
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()
    return render_template('admin/dashboard.html', stats=stats, recent_orders=recent_orders)


# ─── Products ───────────────────────────────────────────────
@admin_bp.route('/products')
@admin_required
def products():
    q = request.args.get('q', '')
    page = request.args.get('page', 1, type=int)
    query = Product.query
    if q:
        query = query.filter(Product.name.ilike(f'%{q}%'))
    products = query.order_by(Product.id.desc()).paginate(page=page, per_page=10, error_out=False)
    categories = Category.query.all()
    return render_template('admin/products.html', products=products, categories=categories, q=q)


@admin_bp.route('/products/add', methods=['GET', 'POST'])
@admin_required
def add_product():
    categories = Category.query.all()
    if request.method == 'POST':
        pid = 'p' + str(uuid.uuid4())[:6]
        product = Product(
            id=pid,
            name=request.form.get('name'),
            price=float(request.form.get('price', 0)),
            category_id=request.form.get('category_id') or None,
            image=request.form.get('image', ''),
            rating=int(request.form.get('rating', 0)),
            badge=request.form.get('badge') or None,
            stock=int(request.form.get('stock', 0)),
            description=request.form.get('description', ''),
        )
        db.session.add(product)
        db.session.commit()
        flash('تم إضافة المنتج بنجاح', 'success')
        return redirect(url_for('admin.products'))
    return render_template('admin/product_form.html', product=None, categories=categories, action='add')


@admin_bp.route('/products/edit/<product_id>', methods=['GET', 'POST'])
@admin_required
def edit_product(product_id):
    product = Product.query.get_or_404(product_id)
    categories = Category.query.all()
    if request.method == 'POST':
        product.name = request.form.get('name')
        product.price = float(request.form.get('price', 0))
        product.category_id = request.form.get('category_id') or None
        product.image = request.form.get('image', '')
        product.rating = int(request.form.get('rating', 0))
        product.badge = request.form.get('badge') or None
        product.stock = int(request.form.get('stock', 0))
        product.description = request.form.get('description', '')
        db.session.commit()
        flash('تم تحديث المنتج بنجاح', 'success')
        return redirect(url_for('admin.products'))
    return render_template('admin/product_form.html', product=product, categories=categories, action='edit')


@admin_bp.route('/products/delete/<product_id>', methods=['POST'])
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    flash('تم حذف المنتج', 'success')
    return redirect(url_for('admin.products'))


# ─── Categories ─────────────────────────────────────────────
@admin_bp.route('/categories')
@admin_required
def categories():
    cats = Category.query.all()
    return render_template('admin/categories.html', categories=cats)


@admin_bp.route('/categories/add', methods=['POST'])
@admin_required
def add_category():
    cat = Category(name=request.form.get('name'), icon=request.form.get('icon', 'tag'))
    db.session.add(cat)
    db.session.commit()
    flash('تم إضافة الفئة', 'success')
    return redirect(url_for('admin.categories'))


@admin_bp.route('/categories/delete/<int:cat_id>', methods=['POST'])
@admin_required
def delete_category(cat_id):
    cat = Category.query.get_or_404(cat_id)
    db.session.delete(cat)
    db.session.commit()
    flash('تم حذف الفئة', 'success')
    return redirect(url_for('admin.categories'))


# ─── Orders ─────────────────────────────────────────────────
@admin_bp.route('/orders')
@admin_required
def orders():
    status = request.args.get('status', '')
    page = request.args.get('page', 1, type=int)
    query = Order.query
    if status:
        query = query.filter(Order.status == status)
    orders = query.order_by(Order.created_at.desc()).paginate(page=page, per_page=10, error_out=False)
    return render_template('admin/orders.html', orders=orders, status=status)


@admin_bp.route('/orders/<int:order_id>')
@admin_required
def order_detail(order_id):
    order = Order.query.get_or_404(order_id)
    return render_template('admin/order_detail.html', order=order)


@admin_bp.route('/orders/<int:order_id>/status', methods=['POST'])
@admin_required
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    order.status = request.form.get('status', order.status)
    db.session.commit()
    flash('تم تحديث حالة الطلب', 'success')
    return redirect(url_for('admin.order_detail', order_id=order_id))


# ─── Users ──────────────────────────────────────────────────
@admin_bp.route('/users')
@admin_required
def users():
    q = request.args.get('q', '')
    page = request.args.get('page', 1, type=int)
    query = User.query.filter_by(is_admin=False)
    if q:
        query = query.filter(User.name.ilike(f'%{q}%') | User.email.ilike(f'%{q}%'))
    users = query.order_by(User.created_at.desc()).paginate(page=page, per_page=10, error_out=False)
    return render_template('admin/users.html', users=users, q=q)


@admin_bp.route('/users/delete/<int:user_id>', methods=['POST'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    flash('تم حذف المستخدم', 'success')
    return redirect(url_for('admin.users'))


# ─── Coupons ────────────────────────────────────────────────
@admin_bp.route('/coupons')
@admin_required
def coupons():
    coupons = Coupon.query.all()
    return render_template('admin/coupons.html', coupons=coupons)


@admin_bp.route('/coupons/add', methods=['POST'])
@admin_required
def add_coupon():
    coupon = Coupon(
        code=request.form.get('code', '').upper(),
        discount_percent=int(request.form.get('discount_percent', 0)),
        is_active=True
    )
    db.session.add(coupon)
    db.session.commit()
    flash('تم إضافة الكوبون', 'success')
    return redirect(url_for('admin.coupons'))


@admin_bp.route('/coupons/toggle/<int:coupon_id>', methods=['POST'])
@admin_required
def toggle_coupon(coupon_id):
    coupon = Coupon.query.get_or_404(coupon_id)
    coupon.is_active = not coupon.is_active
    db.session.commit()
    flash('تم تحديث حالة الكوبون', 'success')
    return redirect(url_for('admin.coupons'))


@admin_bp.route('/coupons/delete/<int:coupon_id>', methods=['POST'])
@admin_required
def delete_coupon(coupon_id):
    coupon = Coupon.query.get_or_404(coupon_id)
    db.session.delete(coupon)
    db.session.commit()
    flash('تم حذف الكوبون', 'success')
    return redirect(url_for('admin.coupons'))


# ─── Newsletter ─────────────────────────────────────────────
@admin_bp.route('/newsletter')
@admin_required
def newsletter():
    subs = Newsletter.query.order_by(Newsletter.subscribed_at.desc()).all()
    return render_template('admin/newsletter.html', subscribers=subs)


# ─── Messages ───────────────────────────────────────────────
@admin_bp.route('/messages')
@admin_required
def messages():
    msgs = ContactMessage.query.order_by(ContactMessage.sent_at.desc()).all()
    return render_template('admin/messages.html', messages=msgs)


# ─── Health ─────────────────────────────────────────────────
@admin_bp.route('/health-check')
def health():
    return jsonify({"status": "healthy", "service": "admin"}), 200
