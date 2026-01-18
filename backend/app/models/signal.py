from app import db
from datetime import datetime
import uuid

class Signal(db.Model):
    __tablename__ = 'signals'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    outcome_id = db.Column(db.String(36), db.ForeignKey('outcomes.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    value = db.Column(db.Float, nullable=True)
    threshold_min = db.Column(db.Float, nullable=True)
    threshold_max = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(50), default='normal')
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def calculate_status(self):
        """Calculate signal status based on thresholds"""
        if self.value is None:
            return 'normal'
        
        if self.threshold_min is not None and self.value < self.threshold_min:
            return 'critical'
        
        if self.threshold_max is not None and self.value > self.threshold_max:
            return 'critical'
        
        # Warning zone (within 10% of threshold)
        if self.threshold_min is not None:
            warning_threshold = self.threshold_min * 1.1
            if self.value < warning_threshold:
                return 'warning'
        
        if self.threshold_max is not None:
            warning_threshold = self.threshold_max * 0.9
            if self.value > warning_threshold:
                return 'warning'
        
        return 'normal'
    
    def update_value(self, new_value):
        """Update signal value and recalculate status"""
        self.value = new_value
        self.status = self.calculate_status()
        self.last_updated = datetime.utcnow()
    
    def to_dict(self):
        return {
            'id': self.id,
            'outcome_id': self.outcome_id,
            'name': self.name,
            'value': self.value,
            'threshold_min': self.threshold_min,
            'threshold_max': self.threshold_max,
            'status': self.status,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Signal {self.name}>'