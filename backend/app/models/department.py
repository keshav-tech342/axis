from app import db
from datetime import datetime
import uuid

class Department(db.Model):
    __tablename__ = 'departments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    is_default = db.Column(db.Boolean, default=False)
    is_custom = db.Column(db.Boolean, default=False)
    owner_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    icon = db.Column(db.String(100), default='folder')
    description = db.Column(db.Text, nullable=True)
    config = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    activities = db.relationship('Activity', backref='department', lazy=True, cascade='all, delete-orphan')
    outcomes = db.relationship('Outcome', backref='department', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_stats=False):
        result = {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'is_default': self.is_default,
            'is_custom': self.is_custom,
            'owner_id': self.owner_id,
            'icon': self.icon,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_stats:
            result['outcome_count'] = len(self.outcomes)
            result['activity_count'] = len([a for a in self.activities if a.status != 'cancelled'])
            
            # Count critical signals
            critical_count = 0
            for outcome in self.outcomes:
                for signal in outcome.signals:
                    if signal.status == 'critical':
                        critical_count += 1
            result['critical_signals'] = critical_count
        
        return result
    
    def __repr__(self):
        return f'<Department {self.name}>'