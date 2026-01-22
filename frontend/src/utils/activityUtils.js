import { 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  XCircle,
  AlertCircle,
  TrendingUp,
  FileCheck,
  Settings,
  Play
} from 'lucide-react';

export const activityTypeIcons = {
  'track': TrendingUp,
  'approve': CheckCircle2,
  'review': FileCheck,
  'update': Settings,
  'execute': Play
};

export const activityStatusIcons = {
  'pending': Clock,
  'in_progress': PlayCircle,
  'completed': CheckCircle2,
  'cancelled': XCircle
};

export const activityPriorityColors = {
  'low': 'from-gray-500 to-slate-500',
  'medium': 'from-blue-500 to-cyan-500',
  'high': 'from-orange-500 to-yellow-500',
  'critical': 'from-red-500 to-pink-500'
};

export const activityStatusColors = {
  'pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'in_progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'completed': 'bg-green-500/20 text-green-300 border-green-500/30',
  'cancelled': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
};

export const getActivityTypeIcon = (type) => {
  return activityTypeIcons[type] || Play;
};

export const getActivityStatusIcon = (status) => {
  return activityStatusIcons[status] || Clock;
};

export const getActivityPriorityColor = (priority) => {
  return activityPriorityColors[priority] || activityPriorityColors['medium'];
};

export const getActivityStatusColor = (status) => {
  return activityStatusColors[status] || activityStatusColors['pending'];
};