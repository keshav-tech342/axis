import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const SignalIndicator = ({ signal, showValue = true, size = 'md' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'normal': return 'bg-green-500/20 border-green-500/50 text-green-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <TrendingDown className="w-4 h-4" />;
      case 'normal': return <TrendingUp className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-2 rounded-lg border ${getStatusColor(signal.status)} ${sizeClasses[size]} font-medium`}
    >
      {getStatusIcon(signal.status)}
      <span>{signal.name}</span>
      {showValue && (
        <span className="ml-auto font-bold">
          {signal.value?.toFixed(1)}
        </span>
      )}
    </motion.div>
  );
};

export default SignalIndicator;