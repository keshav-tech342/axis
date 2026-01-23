import { motion } from 'framer-motion';
import { Activity, AlertTriangle } from 'lucide-react';

const DepartmentHealth = ({ departments }) => {
  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20';
    if (score >= 60) return 'text-blue-400 bg-blue-500/20';
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getHealthBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        Department Health
      </h3>
      
      <div className="space-y-4">
        {departments?.slice(0, 6).map((dept, index) => (
          <motion.div
            key={dept.department_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">
                  {dept.department_name}
                </span>
                {dept.critical_signals > 0 && (
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    {dept.critical_signals}
                  </span>
                )}
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-bold ${getHealthColor(dept.health_score)}`}>
                {dept.health_score}%
              </div>
            </div>
            
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dept.health_score}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full ${getHealthBarColor(dept.health_score)} rounded-full`}
              />
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{dept.total_signals} signals</span>
              {dept.warning_signals > 0 && (
                <span className="text-yellow-400">{dept.warning_signals} warnings</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentHealth;