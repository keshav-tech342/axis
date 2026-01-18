from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from app.extensions import db, jwt, migrate

load_dotenv()

def create_app(config_name='development'):
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.getenv(
        'SECRET_KEY', 'dev-secret-key'
    )

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:axis123@localhost:5433/axis_dev'
    )

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv(
        'JWT_SECRET_KEY', 'jwt-secret'
    )

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # ✅ SAFE: import models AFTER db is bound
    from app.models import user, organization

    # Blueprints
    from app.routes import auth_bp
    app.register_blueprint(auth_bp)

    # After auth_bp
    from app.routes.departments import bp as departments_bp
    app.register_blueprint(departments_bp)


    @app.route('/health')
    def health():
        return {'status': 'healthy'}, 200

    return app
