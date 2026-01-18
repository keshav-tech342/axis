import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity, Zap } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: TrendingUp, label: 'Active Outcomes', value: '24', change: '+12%', color: 'from-purple-500 to-blue-500' },
    { icon: Users, label: 'Team Members', value: '8', change: '+2', color: 'from-blue-500 to-cyan-500' },
    { icon: Activity, label: 'Activities', value: '156', change: '+23%', color: 'from-cyan-500 to-teal-500' },
    { icon: Zap, label: 'Automations', value: '12', change: 'Active', color: 'from-orange-500 to-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Test User! 👋</h1>
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
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity blur-xl" 
                style={{ background: `linear-gradient(to right, ${stat.color})` }}
              />
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

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Dashboard Content Coming Soon!</h2>
        <p className="text-gray-400">We'll build the charts and visualizations in the next days.</p>
      </motion.div>
    </div>
  );
};

export default Dashboard;