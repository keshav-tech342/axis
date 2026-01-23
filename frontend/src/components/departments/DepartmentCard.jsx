import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const DepartmentCard = ({ department, index }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'on track':
        return 'text-green-400 bg-green-400/10';
      case 'at risk':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'off track':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'on track':
        return <CheckCircle className="w-5 h-5" />;
      case 'at risk':
        return <AlertTriangle className="w-5 h-5" />;
      case 'off track':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      key={department.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
      onClick={() => navigate(`/departments/${department.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">{department.name}</h3>
          <p className="text-gray-400 text-sm mb-4">{department.description}</p>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(department.status)}`}>
              {getStatusIcon(department.status)}
              <span className="text-sm font-medium">{department.status || 'Not Started'}</span>
            </div>

            {department.target_date && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>Due {new Date(department.target_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {department.progress !== undefined && (
          <div className="ml-6">
            <div className="text-right mb-2">
              <span className="text-2xl font-bold text-white">{department.progress}%</span>
            </div>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                style={{ width: `${department.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DepartmentCard;
