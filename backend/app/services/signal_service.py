from app import db
from app.models.signal import Signal
from app.models.outcome import Outcome
from datetime import datetime

class SignalService:
    
    @staticmethod
    def get_all(filters=None):
        """Get all signals with optional filters"""
        query = Signal.query
        
        if filters:
            if 'outcome_id' in filters:
                query = query.filter_by(outcome_id=filters['outcome_id'])
            if 'status' in filters:
                query = query.filter_by(status=filters['status'])
        
        return query.order_by(Signal.last_updated.desc()).all()
    
    @staticmethod
    def get_by_id(signal_id):
        """Get signal by ID"""
        return Signal.query.get(signal_id)
    
    @staticmethod
    def create(data):
        """Create a new signal"""
        try:
            signal = Signal(
                outcome_id=data['outcome_id'],
                name=data['name'],
                value=data.get('value', 0),
                threshold_min=data.get('threshold_min'),
                threshold_max=data.get('threshold_max')
            )
            
            signal.status = signal.calculate_status()
            db.session.add(signal)
            db.session.commit()
            
            return signal, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def update_value(signal_id, new_value):
        """Update signal value and recalculate status"""
        signal = Signal.query.get(signal_id)
        
        if not signal:
            return None, "Signal not found"
        
        try:
            old_status = signal.status
            signal.update_value(new_value)
            
            # Update outcome's current value (average of all signals)
            outcome = Outcome.query.get(signal.outcome_id)
            if outcome:
                signals = Signal.query.filter_by(outcome_id=outcome.id).all()
                avg_value = sum(s.value or 0 for s in signals) / len(signals) if signals else 0
                outcome.current_value = avg_value
                outcome.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            # Check if status changed and trigger automation (Day 15)
            status_changed = old_status != signal.status
            
            return signal, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def update(signal_id, data):
        """Update signal properties"""
        signal = Signal.query.get(signal_id)
        
        if not signal:
            return None, "Signal not found"
        
        try:
            for key, value in data.items():
                if hasattr(signal, key) and key not in ['id', 'created_at', 'outcome_id']:
                    setattr(signal, key, value)
            
            # Recalculate status after updates
            signal.status = signal.calculate_status()
            signal.last_updated = datetime.utcnow()
            
            db.session.commit()
            return signal, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def delete(signal_id):
        """Delete a signal"""
        signal = Signal.query.get(signal_id)
        
        if not signal:
            return False, "Signal not found"
        
        try:
            db.session.delete(signal)
            db.session.commit()
            return True, None
            
        except Exception as e:
            db.session.rollback()
            return False, str(e)
    
    @staticmethod
    def get_critical_signals(limit=10):
        """Get critical signals across all outcomes"""
        return Signal.query.filter_by(status='critical').order_by(Signal.last_updated.desc()).limit(limit).all()
    
    @staticmethod
    def get_warning_signals(limit=10):
        """Get warning signals across all outcomes"""
        return Signal.query.filter_by(status='warning').order_by(Signal.last_updated.desc()).limit(limit).all()