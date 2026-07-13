from marshmallow import Schema, fields, validate

class OrderItemSchema(Schema):
    id = fields.Int(dump_only=True)
    product_id = fields.Str(required=True, validate=validate.Length(max=10))
    product_name = fields.Str(required=True, validate=validate.Length(max=200))
    quantity = fields.Int(required=True, validate=validate.Range(min=1))
    unit_price = fields.Float(required=True)
    total_price = fields.Float(dump_only=True)

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    session_id = fields.Str(dump_only=True)
    status = fields.Str(dump_only=True)
    total_amount = fields.Float(dump_only=True)
    shipping_address = fields.Str(required=True)
    phone = fields.Str(required=True, validate=validate.Length(max=20))
    payment_method = fields.Str(required=True, validate=validate.Length(max=50))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    
    items = fields.List(fields.Nested(OrderItemSchema), required=True)

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
