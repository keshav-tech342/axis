from app import db
from datetime import datetime
import uuid

class Outcome(db.Model):
    __tablename__ = 'outcomes'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    target_value = db.Column(db.Float, nullable=True)
    current_value = db.Column(db.Float, nullable=True)
    unit = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(50), default='active')
    owner_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    signals = db.relationship('Signal', backref='outcome', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_signals=False):
        result = {
            'id': self.id,
            'department_id': self.department_id,
            'name': self.name,
            'description': self.description,
            'target_value': self.target_value,
            'current_value': self.current_value,
            'unit': self.unit,
            'status': self.status,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_signals:
            result['signals'] = [signal.to_dict() for signal in self.signals]
        
        return result
    
    def __repr__(self):
        return f'<Outcome {self.name}>'