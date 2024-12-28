from flask import Flask
from flask_smorest import Api
from flask_cors import CORS
from app.routes import blp

def create_app():
    app = Flask(__name__)

   
    app.config['API_TITLE'] = 'Flask Backend API'
    app.config['API_VERSION'] = '1.0'
    app.config['OPENAPI_VERSION'] = '3.0.3'
    app.config['OPENAPI_URL_PREFIX'] = '/docs'
    app.config['OPENAPI_SWAGGER_UI_PATH'] = '/'
    app.config['OPENAPI_SWAGGER_UI_URL'] = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'

  
    CORS(app)


    api = Api(app)
    api.register_blueprint(blp)

    return app
