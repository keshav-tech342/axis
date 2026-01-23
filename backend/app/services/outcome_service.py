from app import db
from app.models.outcome import Outcome
from app.models.signal import Signal
from app.models.department import Department
from datetime import datetime
from sqlalchemy.exc import IntegrityError

class OutcomeService:
    
    # Default outcomes for each department type
    DEFAULT_OUTCOMES = {
        'leadership': [
            {
                'name': 'Company Strategy Alignment',
                'description': 'Overall strategic alignment score',
                'target_value': 90,
                'current_value': 75,
                'unit': '%',
                'signals': [
                    {'name': 'OKR Completion Rate', 'value': 70, 'threshold_min': 80, 'threshold_max': None},
                    {'name': 'Strategic Initiative Progress', 'value': 75, 'threshold_min': 75, 'threshold_max': None},
                ]
            },
        ],
        'finance': [
            {
                'name': 'Cash Runway',
                'description': 'Months of cash remaining at current burn rate',
                'target_value': 12,
                'current_value': 6,
                'unit': 'months',
                'signals': [
                    {'name': 'Monthly Burn Rate', 'value': 85000, 'threshold_min': None, 'threshold_max': 100000},
                    {'name': 'Cash Balance', 'value': 510000, 'threshold_min': 500000, 'threshold_max': None},
                ]
            },
            {
                'name': 'Revenue Growth',
                'description': 'Month-over-month revenue growth',
                'target_value': 20,
                'current_value': 15,
                'unit': '%',
                'signals': [
                    {'name': 'MRR', 'value': 45000, 'threshold_min': 40000, 'threshold_max': None},
                    {'name': 'Revenue Growth Rate', 'value': 15, 'threshold_min': 20, 'threshold_max': None},
                ]
            },
        ],
        'people': [
            {
                'name': 'Team Health',
                'description': 'Overall team satisfaction and retention',
                'target_value': 85,
                'current_value': 78,
                'unit': '%',
                'signals': [
                    {'name': 'Employee Satisfaction Score', 'value': 78, 'threshold_min': 80, 'threshold_max': None},
                    {'name': 'Attrition Rate', 'value': 12, 'threshold_min': None, 'threshold_max': 10},
                    {'name': 'Time to Hire', 'value': 45, 'threshold_min': None, 'threshold_max': 30},
                ]
            },
        ],
        'sales': [
            {
                'name': 'Sales Pipeline Health',
                'description': 'Pipeline value and conversion metrics',
                'target_value': 500000,
                'current_value': 380000,
                'unit': '$',
                'signals': [
                    {'name': 'Pipeline Value', 'value': 380000, 'threshold_min': 400000, 'threshold_max': None},
                    {'name': 'Win Rate', 'value': 22, 'threshold_min': 25, 'threshold_max': None},
                    {'name': 'Average Deal Size', 'value': 15000, 'threshold_min': 12000, 'threshold_max': None},
                ]
            },
        ],
        'operations': [
            {
                'name': 'Operational Efficiency',
                'description': 'Project delivery and resource utilization',
                'target_value': 90,
                'current_value': 82,
                'unit': '%',
                'signals': [
                    {'name': 'On-Time Delivery Rate', 'value': 85, 'threshold_min': 90, 'threshold_max': None},
                    {'name': 'Resource Utilization', 'value': 78, 'threshold_min': 75, 'threshold_max': 85},
                ]
            },
        ],
        'customer': [
            {
                'name': 'Customer Satisfaction',
                'description': 'Overall customer health and satisfaction',
                'target_value': 90,
                'current_value': 82,
                'unit': '%',
                'signals': [
                    {'name': 'CSAT Score', 'value': 82, 'threshold_min': 85, 'threshold_max': None},
                    {'name': 'NPS', 'value': 45, 'threshold_min': 50, 'threshold_max': None},
                    {'name': 'Churn Rate', 'value': 5, 'threshold_min': None, 'threshold_max': 3},
                ]
            },
        ],
    }
    
    @staticmethod
    def create_default_outcomes(department_id, owner_id=None):
        """Create default outcomes and signals for a department"""
        department = Department.query.get(department_id)
        if not department:
            return []
        
        outcomes_config = OutcomeService.DEFAULT_OUTCOMES.get(department.type, [])
        outcomes = []
        
        for config in outcomes_config:
            # Create outcome
            outcome = Outcome(
                department_id=department_id,
                name=config['name'],
                description=config['description'],
                target_value=config['target_value'],
                current_value=config['current_value'],
                unit=config['unit'],
                status='active',
                owner_id=owner_id
            )
            db.session.add(outcome)
            db.session.flush()  # Get outcome ID
            
            # Create signals for this outcome
            for signal_config in config.get('signals', []):
                signal = Signal(
                    outcome_id=outcome.id,
                    name=signal_config['name'],
                    value=signal_config['value'],
                    threshold_min=signal_config.get('threshold_min'),
                    threshold_max=signal_config.get('threshold_max')
                )
                signal.status = signal.calculate_status()
                db.session.add(signal)
            
            outcomes.append(outcome)
        
        db.session.commit()
        return outcomes
    
    @staticmethod
    def get_all(filters=None):
        """Get all outcomes with optional filters"""
        query = Outcome.query
        
        if filters:
            if 'department_id' in filters:
                query = query.filter_by(department_id=filters['department_id'])
            if 'status' in filters:
                query = query.filter_by(status=filters['status'])
            if 'owner_id' in filters:
                query = query.filter_by(owner_id=filters['owner_id'])
        
        return query.order_by(Outcome.created_at.desc()).all()
    
    @staticmethod
    def get_by_id(outcome_id):
        """Get outcome by ID"""
        return Outcome.query.get(outcome_id)
    
    @staticmethod
    def create(data, user_id):
        """Create a new outcome"""
        try:
            outcome = Outcome(
                department_id=data['department_id'],
                name=data['name'],
                description=data.get('description'),
                target_value=data.get('target_value'),
                current_value=data.get('current_value', 0),
                unit=data.get('unit'),
                status='active',
                owner_id=user_id
            )
            
            db.session.add(outcome)
            db.session.flush()
            
            # Create signals if provided
            signals_data = data.get('signals', [])
            for signal_data in signals_data:
                signal = Signal(
                    outcome_id=outcome.id,
                    name=signal_data['name'],
                    value=signal_data.get('value', 0),
                    threshold_min=signal_data.get('threshold_min'),
                    threshold_max=signal_data.get('threshold_max')
                )
                signal.status = signal.calculate_status()
                db.session.add(signal)
            
            db.session.commit()
            return outcome, None
            
        except IntegrityError as e:
            db.session.rollback()
            return None, "Outcome name already exists in this department"
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def update(outcome_id, data):
        """Update an outcome"""
        outcome = Outcome.query.get(outcome_id)
        
        if not outcome:
            return None, "Outcome not found"
        
        try:
            # Update outcome fields
            for key, value in data.items():
                if hasattr(outcome, key) and key not in ['id', 'created_at']:
                    setattr(outcome, key, value)
            
            outcome.updated_at = datetime.utcnow()
            db.session.commit()
            
            return outcome, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def delete(outcome_id):
        """Delete an outcome"""
        outcome = Outcome.query.get(outcome_id)
        
        if not outcome:
            return False, "Outcome not found"
        
        try:
            db.session.delete(outcome)
            db.session.commit()
            return True, None
            
        except Exception as e:
            db.session.rollback()
            return False, str(e)
    
    @staticmethod
    def get_with_signals(outcome_id):
        """Get outcome with all its signals"""
        outcome = Outcome.query.get(outcome_id)
        if not outcome:
            return None
        
        return outcome.to_dict(include_signals=True)