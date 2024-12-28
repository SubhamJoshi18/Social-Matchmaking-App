from marshmallow import Schema, fields

class ExampleSchema(Schema):
    message = fields.String(required=True, description="Response message")
