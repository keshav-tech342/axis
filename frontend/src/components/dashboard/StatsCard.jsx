import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'purple' }) => {
  const colorClasses = {
    purple: 'from-purple-600 to-blue-600',
    green: 'from-green-600 to-emerald-600',
    red: 'from-red-600 to-orange-600',
    blue: 'from-blue-600 to-cyan-600',
    yellow: 'from-yellow-600 to-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden group hover:border-purple-500/50 transition-all"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-10 transition-opacity`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div className="mb-1">
          <div className="text-3xl font-bold text-white mb-1">
            {value}
          </div>
          <div className="text-sm text-gray-400">
            {title}
          </div>
        </div>
        
        {trendValue && (
          <div className="text-xs text-gray-500 mt-2">
            {trendValue}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;