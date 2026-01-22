import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import ActivityCard from '../components/activities/ActivityCard';
import ActivityExecuteModal from '../components/activities/ActivityExecuteModal';
import activityService from '../services/activityService';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showExecuteModal, setShowExecuteModal] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getAll({ include_relations: 'true' });
      if (response?.data?.activities) {
        setActivities(response.data.activities);
      }
    } catch (err) {
      setError('Failed to load activities');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = (activity) => {
    setSelectedActivity(activity);
    setShowExecuteModal(true);
  };

  const handleExecuteSuccess = () => {
    fetchActivities();
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || activity.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: activities.length,
    pending: activities.filter(a => a.status === 'pending').length,
    completed: activities.filter(a => a.status === 'completed').length,
    critical: activities.filter(a => a.priority === 'critical').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            Activities
          </h1>
          <p className="text-gray-400">
            Track and execute activities across all departments
          </p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all">
          <Plus className="w-5 h-5" />
          Create Activity
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'blue' },
          { label: 'Pending', value: stats.pending, color: 'yellow' },
          { label: 'Completed', value: stats.completed, color: 'green' },
          { label: 'Critical', value: stats.critical, color: 'red' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center"
          >
            <p className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>
              {stat.value}
            </p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-6 bg-red-500/20 border border-red-500/30 rounded-2xl text-center">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Activities Grid */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredActivities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                onExecute={handleExecute}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* No Results */}
      {!loading && !error && filteredActivities.length === 0 && (
        <div className="text-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
          <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No activities found</p>
        </div>
      )}

      {/* Execute Modal */}
      {selectedActivity && (
        <ActivityExecuteModal
          activity={selectedActivity}
          isOpen={showExecuteModal}
          onClose={() => setShowExecuteModal(false)}
          onSuccess={handleExecuteSuccess}
        />
      )}
    </div>
  );
};

export default Activities;