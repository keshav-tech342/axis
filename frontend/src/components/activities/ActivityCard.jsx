import { useState } from 'react';
import { Clock, User, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import ActivityExecuteModal from './ActivityExecuteModal';

const ActivityCard = ({ activity, onExecute }) => {
  const [showExecuteModal, setShowExecuteModal] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'low': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'in_progress': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleExecuteSuccess = () => {
    setShowExecuteModal(false);
    if (onExecute) onExecute();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors">
              {activity.name}
            </h3>
            {activity.description && (
              <p className="text-gray-400 text-sm line-clamp-2">
                {activity.description}
              </p>
            )}
          </div>
          {activity.status !== 'completed' && (
            <button
              onClick={() => setShowExecuteModal(true)}
              className="ml-4 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Execute</span>
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(activity.priority)}`}>
            {activity.priority}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
            {activity.status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium text-purple-400 bg-purple-500/20 border border-purple-500/30 capitalize">
            {activity.type}
          </span>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-sm">
          {activity.department && (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <span>{activity.department.name}</span>
            </div>
          )}
          
          {activity.owner && (
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-4 h-4" />
              <span>Owner: {activity.owner.full_name}</span>
            </div>
          )}

          {activity.due_date && (
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Due: {new Date(activity.due_date).toLocaleDateString()}</span>
            </div>
          )}

          {activity.completed_at && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed: {new Date(activity.completed_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </motion.div>

      <ActivityExecuteModal
        activity={activity}
        isOpen={showExecuteModal}
        onClose={() => setShowExecuteModal(false)}
        onSuccess={handleExecuteSuccess}
      />
    </>
  );
};

export default ActivityCard;