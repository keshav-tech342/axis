import bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta
from app.extensions import db
from app.models.user import User
from app.models.organization import Organization
from datetime import datetime


class AuthService:
    
    @staticmethod
    def hash_password(password):
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    @staticmethod
    def verify_password(password, password_hash):
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    
    @staticmethod
    def validate_password_strength(password):
        """Validate password meets security requirements"""
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters")
        if not any(c.isupper() for c in password):
            errors.append("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in password):
            errors.append("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in password):
            errors.append("Password must contain at least one number")
        
        return errors
    
    @staticmethod
    def register(email, password, full_name, organization_name):
        """Register a new user and organization"""
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return None, "Email already registered"
        
        # Validate password strength
        password_errors = AuthService.validate_password_strength(password)
        if password_errors:
            return None, password_errors[0]
        
        try:
            # Create organization
            organization = Organization(name=organization_name)
            db.session.add(organization)
            db.session.flush()  # Get organization ID
            
            # Create user
            user = User(
                email=email,
                password_hash=AuthService.hash_password(password),
                full_name=full_name,
                organization_id=organization.id
            )
            db.session.add(user)
            db.session.commit()
            
            return user, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def login(email, password):
        """Authenticate user and return tokens"""
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return None, None, "Invalid email or password"
        
        if not user.is_active:
            return None, None, "Account is inactive"
        
        if not AuthService.verify_password(password, user.password_hash):
            return None, None, "Invalid email or password"
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(
            identity=user.id,
            additional_claims={
                'email': user.email,
                'organization_id': user.organization_id
            },
            expires_delta=timedelta(hours=1)
        )
        
        refresh_token = create_refresh_token(
            identity=user.id,
            expires_delta=timedelta(days=30)
        )
        
        return access_token, refresh_token, None