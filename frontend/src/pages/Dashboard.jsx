import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity, Zap, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      icon: TrendingUp, 
      label: 'Active Outcomes', 
      value: '24', 
      change: '+12%', 
      color: 'from-purple-500 to-blue-500',
      trend: 'up'
    },
    { 
      icon: Users, 
      label: 'Team Members', 
      value: '8', 
      change: '+2', 
      color: 'from-blue-500 to-cyan-500',
      trend: 'up'
    },
    { 
      icon: Activity, 
      label: 'Activities', 
      value: '156', 
      change: '+23%', 
      color: 'from-cyan-500 to-teal-500',
      trend: 'up'
    },
    { 
      icon: Zap, 
      label: 'Automations', 
      value: '12', 
      change: 'Active', 
      color: 'from-orange-500 to-pink-500',
      trend: 'neutral'
    },
  ];

  const criticalAlerts = [
    { id: 1, title: 'Cash runway below 6 months', department: 'Finance', severity: 'critical' },
    { id: 2, title: 'Hiring target behind schedule', department: 'People', severity: 'warning' },
    { id: 3, title: 'Customer churn rate increasing', department: 'Customer', severity: 'warning' },
  ];

  const recentActivities = [
    { id: 1, title: 'Q4 Budget Review', department: 'Finance', time: '2 hours ago', status: 'completed' },
    { id: 2, title: 'Approve New Hire', department: 'People', time: '4 hours ago', status: 'pending' },
    { id: 3, title: 'Sales Pipeline Review', department: 'Sales', time: '1 day ago', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
        <p className="text-gray-400">Here's what's happening with your organization today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity blur-xl`} />
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                  <span className="text-sm text-green-400">{stat.change}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              Critical Alerts
            </h2>
            <span className="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-full">
              {criticalAlerts.length}
            </span>
          </div>

          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <p className="text-white font-medium">{alert.title}</p>
                    </div>
                    <p className="text-sm text-gray-400">{alert.department}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
            View all alerts
          </button>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              Recent Activities
            </h2>
          </div>

          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{activity.title}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{activity.department}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activity.status === 'completed'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
            View all activities
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/departments')}
            className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span>View Departments</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          
          <button className="p-4 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all text-left group">
            <div className="flex items-center justify-between">
              <span>Create Activity</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          
          <button className="p-4 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all text-left group">
            <div className="flex items-center justify-between">
              <span>View Analytics</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;