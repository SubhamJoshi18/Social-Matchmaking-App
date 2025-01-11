from flask_smorest import Blueprint
from flask import jsonify
from app.schemas import ExampleSchema

blp = Blueprint('example', __name__, url_prefix='/api', description="Example API")

@blp.route('/ping', methods=['GET'])
@blp.response(200, ExampleSchema)
def ping():
    """Ping endpoint to check server health."""
    return {'message': 'Pong!'}
