from app import db
from app.models.department import Department
from app.models.outcome import Outcome
from app.models.signal import Signal
from app.models.activity import Activity
from sqlalchemy import func
from datetime import datetime, timedelta

class AnalyticsService:
    
    @staticmethod
    def get_dashboard_summary(organization_id):
        """Get executive dashboard summary"""
        
        # Get all departments for organization
        departments = Department.query.filter_by(organization_id=organization_id).all()
        dept_ids = [d.id for d in departments]
        
        # Get critical signals
        critical_signals = db.session.query(Signal, Outcome, Department).join(
            Outcome, Signal.outcome_id == Outcome.id
        ).join(
            Department, Outcome.department_id == Department.id
        ).filter(
            Department.organization_id == organization_id,
            Signal.status == 'critical'
        ).order_by(Signal.last_updated.desc()).limit(3).all()
        
        # Get warning signals
        warning_signals = db.session.query(Signal, Outcome, Department).join(
            Outcome, Signal.outcome_id == Outcome.id
        ).join(
            Department, Outcome.department_id == Department.id
        ).filter(
            Department.organization_id == organization_id,
            Signal.status == 'warning'
        ).order_by(Signal.last_updated.desc()).limit(3).all()
        
        # Get pending activities
        pending_activities = Activity.query.filter(
            Activity.department_id.in_(dept_ids),
            Activity.status == 'pending'
        ).count()
        
        # Get completed activities (last 7 days)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        completed_activities = Activity.query.filter(
            Activity.department_id.in_(dept_ids),
            Activity.status == 'completed',
            Activity.completed_at >= seven_days_ago
        ).count()
        
        # Get total outcomes
        total_outcomes = Outcome.query.filter(
            Outcome.department_id.in_(dept_ids),
            Outcome.status == 'active'
        ).count()
        
        # Department health (based on critical signals)
        department_health = []
        for dept in departments:
            critical_count = db.session.query(Signal).join(Outcome).filter(
                Outcome.department_id == dept.id,
                Signal.status == 'critical'
            ).count()
            
            warning_count = db.session.query(Signal).join(Outcome).filter(
                Outcome.department_id == dept.id,
                Signal.status == 'warning'
            ).count()
            
            total_signals = db.session.query(Signal).join(Outcome).filter(
                Outcome.department_id == dept.id
            ).count()
            
            health_score = 100
            if total_signals > 0:
                health_score = max(0, 100 - (critical_count * 30) - (warning_count * 15))
            
            department_health.append({
                'department_id': dept.id,
                'department_name': dept.name,
                'department_type': dept.type,
                'health_score': health_score,
                'critical_signals': critical_count,
                'warning_signals': warning_count,
                'total_signals': total_signals
            })
        
        # Sort by health score
        department_health.sort(key=lambda x: x['health_score'])
        
        return {
            'summary': {
                'total_departments': len(departments),
                'total_outcomes': total_outcomes,
                'pending_activities': pending_activities,
                'completed_activities_7d': completed_activities,
                'critical_signals': len(critical_signals),
                'warning_signals': len(warning_signals)
            },
            'top_critical_signals': [
                {
                    'signal': s.to_dict(),
                    'outcome': o.to_dict(),
                    'department': {
                        'id': d.id,
                        'name': d.name,
                        'type': d.type
                    }
                } for s, o, d in critical_signals
            ],
            'top_warning_signals': [
                {
                    'signal': s.to_dict(),
                    'outcome': o.to_dict(),
                    'department': {
                        'id': d.id,
                        'name': d.name,
                        'type': d.type
                    }
                } for s, o, d in warning_signals
            ],
            'department_health': department_health
        }
    
    @staticmethod
    def get_activity_trends(organization_id, days=30):
        """Get activity completion trends"""
        departments = Department.query.filter_by(organization_id=organization_id).all()
        dept_ids = [d.id for d in departments]
        
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Group activities by day
        activities_by_day = db.session.query(
            func.date(Activity.completed_at).label('date'),
            func.count(Activity.id).label('count')
        ).filter(
            Activity.department_id.in_(dept_ids),
            Activity.status == 'completed',
            Activity.completed_at >= start_date
        ).group_by(func.date(Activity.completed_at)).all()
        
        # Format for chart
        trend_data = [
            {
                'date': row.date.isoformat(),
                'count': row.count
            } for row in activities_by_day
        ]
        
        return trend_data
    
    @staticmethod
    def get_outcome_progress(organization_id):
        """Get overall outcome progress"""
        departments = Department.query.filter_by(organization_id=organization_id).all()
        dept_ids = [d.id for d in departments]
        
        outcomes = Outcome.query.filter(
            Outcome.department_id.in_(dept_ids),
            Outcome.status == 'active'
        ).all()
        
        progress_data = []
        for outcome in outcomes:
            if outcome.target_value and outcome.target_value > 0:
                progress = (outcome.current_value / outcome.target_value) * 100
                progress_data.append({
                    'outcome_id': outcome.id,
                    'outcome_name': outcome.name,
                    'department_id': outcome.department_id,
                    'current_value': outcome.current_value,
                    'target_value': outcome.target_value,
                    'progress': min(progress, 100),
                    'unit': outcome.unit
                })
        
        return progress_data