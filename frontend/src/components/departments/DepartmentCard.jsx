import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, Activity, ChevronRight } from 'lucide-react';
import { getDepartmentIcon, getDepartmentColor } from '../../utils/departmentIcons';

const DepartmentCard = ({ department, index }) => {
  const navigate = useNavigate();
  const Icon = getDepartmentIcon(department.icon);
  const colorClass = getDepartmentColor(department.type);

  const getStatusColor = (count) => {
    if (count === 0) return 'text-green-400';
    if (count <= 2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const criticalCount = department.critical_signals || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow Effect on Hover */}
      <motion.div
        className={`absolute -inset-0.5 bg-gradient-to-r ${colorClass} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}
      />

      {/* Card */}
      <div
        onClick={() => navigate(`/departments/${department.id}`)}
        className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl" />
        </div>

        {/* Critical Badge */}
        {criticalCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full"
          >
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-xs font-semibold text-red-300">{criticalCount}</span>
          </motion.div>
        )}

        {/* Icon Section */}
        <div className="relative mb-4">
          <motion.div
            className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${colorClass} rounded-2xl shadow-lg`}
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-8 h-8 text-white" />
            
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          </motion.div>
        </div>

        {/* Department Info */}
        <div className="relative">
          <h3 className="text-xl font-bold text-white mb-1 flex items-center justify-between">
            {department.name}
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {department.description || 'No description available'}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Outcomes */}
            <div className="relative">
              <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                <TrendingUp className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-lg font-bold text-white">
                  {department.outcome_count || 0}
                </span>
                <span className="text-xs text-gray-400">Outcomes</span>
              </div>
            </div>

            {/* Activities */}
            <div className="relative">
              <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                <Activity className="w-5 h-5 text-purple-400 mb-1" />
                <span className="text-lg font-bold text-white">
                  {department.activity_count || 0}
                </span>
                <span className="text-xs text-gray-400">Activities</span>
              </div>
            </div>

            {/* Status */}
            <div className="relative">
              <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                <div className={`w-3 h-3 rounded-full mb-2 ${
                  criticalCount === 0 ? 'bg-green-400' :
                  criticalCount <= 2 ? 'bg-yellow-400' : 'bg-red-400'
                }`}>
                  <motion.div
                    className="w-full h-full rounded-full"
                    animate={{
                      opacity: [1, 0.5, 1],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>
                <span className={`text-xs font-semibold ${getStatusColor(criticalCount)}`}>
                  {criticalCount === 0 ? 'Healthy' : criticalCount <= 2 ? 'Warning' : 'Critical'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Gradient Border */}
        <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity pointer-events-none`} />
      </div>
    </motion.div>
  );
};

export default DepartmentCard;