import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import activityService from '../../services/activityService';

const ActivityExecuteModal = ({ activity, isOpen, onClose, onSuccess }) => {
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [formData, setFormData] = useState({});

  const handleExecute = async () => {
    setExecuting(true);
    setError('');

    try {
      const executionData = {
        notes,
        timestamp: new Date().toISOString(),
        ...formData
      };

      await activityService.execute(activity.id, executionData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to execute activity');
    } finally {
      setExecuting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Execute Activity
                </h2>
                <p className="text-gray-400 text-sm">
                  {activity.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Activity Details */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">Activity Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{activity.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority:</span>
                  <span className={`capitalize ${
                    activity.priority === 'critical' ? 'text-red-400' :
                    activity.priority === 'high' ? 'text-orange-400' :
                    activity.priority === 'medium' ? 'text-blue-400' :
                    'text-gray-400'
                  }`}>
                    {activity.priority}
                  </span>
                </div>
                {activity.department?.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Department:</span>
                    <span className="text-white">{activity.department.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Execution Form */}
            <div className="space-y-4">
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Execution Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this execution..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                />
              </div>

              {/* Activity-specific fields based on type */}
              {activity.type === 'approve' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Decision
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, approved: true })}
                      className={`px-4 py-3 rounded-xl border transition-all ${
                        formData.approved === true
                          ? 'bg-green-500/20 border-green-500/50 text-green-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, approved: false })}
                      className={`px-4 py-3 rounded-xl border transition-all ${
                        formData.approved === false
                          ? 'bg-red-500/20 border-red-500/50 text-red-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              )}

              {activity.type === 'update' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Updated Value
                  </label>
                  <input
                    type="text"
                    value={formData.updated_value || ''}
                    onChange={(e) => setFormData({ ...formData, updated_value: e.target.value })}
                    placeholder="Enter new value..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={executing}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={executing}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {executing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Execute Activity
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActivityExecuteModal;