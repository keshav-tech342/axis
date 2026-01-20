from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from app.extensions import db, jwt, migrate

load_dotenv()

def create_app(config_name='development'):
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.getenv(
        'SECRET_KEY',
        'dev-secret-key-change-in-production'
    )
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:password@localhost:5433/axis_dev'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv(
        'JWT_SECRET_KEY',
        'jwt-secret-key'
    )

    # ✅ init extensions (THIS REGISTERS THE APP)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # CORS
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173"
                ],
                "supports_credentials": True
            }
        }
    )

    # Blueprints
    from app.routes import auth_bp
    app.register_blueprint(auth_bp)

    from app.routes import departments
    app.register_blueprint(departments.bp)

    @app.route("/health")
    def health():
        return {"status": "healthy"}, 200

    return app
