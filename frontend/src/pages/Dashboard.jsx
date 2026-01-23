import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Target, CheckCircle, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import AlertPanel from '../components/dashboard/AlertPanel';
import DepartmentHealth from '../components/dashboard/DepartmentHealth';
import analyticsService from '../services/analyticsService';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-600 rounded-xl">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.full_name?.split(' ')[0]}
              </h1>
              <p className="text-gray-400">Here's what's happening with your organization</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Total Departments"
            value={dashboardData?.summary?.total_departments || 0}
            icon={LayoutDashboard}
            color="purple"
          />
          <StatsCard
            title="Active Outcomes"
            value={dashboardData?.summary?.total_outcomes || 0}
            icon={Target}
            color="blue"
          />
          <StatsCard
            title="Completed (7d)"
            value={dashboardData?.summary?.completed_activities_7d || 0}
            icon={CheckCircle}
            color="green"
            trendValue="Last 7 days"
          />
          <StatsCard
            title="Critical Signals"
            value={dashboardData?.summary?.critical_signals || 0}
            icon={AlertTriangle}
            color="red"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alerts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <AlertPanel
              criticalSignals={dashboardData?.top_critical_signals}
              warningSignals={dashboardData?.top_warning_signals}
            />
          </motion.div>

          {/* Right Column - Department Health */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <DepartmentHealth departments={dashboardData?.department_health} />
          </motion.div>
        </div>

        {/* Pending Activities */}
        {dashboardData?.summary?.pending_activities > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-yellow-400 font-semibold">
                {dashboardData.summary.pending_activities} Pending Activities
              </div>
              <div className="text-yellow-200 text-sm">
                Review and complete pending tasks to keep your organization on track
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;