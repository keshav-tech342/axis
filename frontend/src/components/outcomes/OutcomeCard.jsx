import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Edit, Trash2, Eye } from 'lucide-react';
import SignalIndicator from './SignalIndicator';

const OutcomeCard = ({ outcome, onUpdate, onDelete, onView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getProgressPercentage = () => {
    if (!outcome.target_value || outcome.target_value === 0) return 0;
    return Math.min((outcome.current_value / outcome.target_value) * 100, 100);
  };

  const getProgressColor = () => {
    const progress = getProgressPercentage();
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const criticalSignals = outcome.signals?.filter(s => s.status === 'critical').length || 0;
  const warningSignals = outcome.signals?.filter(s => s.status === 'warning').length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all relative overflow-hidden group"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">
                {outcome.name}
              </h3>
              {outcome.description && (
                <p className="text-gray-400 text-sm line-clamp-2">
                  {outcome.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            className="flex items-center gap-2"
          >
            {onView && (
              <button
                onClick={() => onView(outcome)}
                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            {onUpdate && (
              <button
                onClick={() => onUpdate(outcome)}
                className="p-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(outcome)}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">
                {outcome.current_value?.toFixed(1)} {outcome.unit}
              </span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-400">
                {outcome.target_value?.toFixed(1)} {outcome.unit}
              </span>
            </div>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${getProgressColor()} rounded-full`}
            />
          </div>
          <div className="mt-1 text-right text-xs text-gray-500">
            {getProgressPercentage().toFixed(1)}%
          </div>
        </div>

        {/* Alert Badges */}
        {(criticalSignals > 0 || warningSignals > 0) && (
          <div className="flex items-center gap-2 mb-4">
            {criticalSignals > 0 && (
              <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-medium">
                {criticalSignals} Critical
              </span>
            )}
            {warningSignals > 0 && (
              <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-medium">
                {warningSignals} Warning
              </span>
            )}
          </div>
        )}

        {/* Signals */}
        {outcome.signals && outcome.signals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">
                Signals ({outcome.signals.length})
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {outcome.signals.slice(0, 3).map((signal) => (
                <SignalIndicator key={signal.id} signal={signal} size="sm" />
              ))}
              {outcome.signals.length > 3 && (
                <button
                  onClick={() => onView && onView(outcome)}
                  className="text-xs text-purple-400 hover:text-purple-300 text-left transition-colors"
                >
                  + {outcome.signals.length - 3} more signals
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
          <span>Updated {new Date(outcome.updated_at).toLocaleDateString()}</span>
          <span className="capitalize">{outcome.status}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OutcomeCard;