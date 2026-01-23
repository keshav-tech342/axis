import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import SignalIndicator from '../outcomes/SignalIndicator';

const AlertPanel = ({ criticalSignals, warningSignals }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        Critical Alerts
      </h3>
      
      {/* Critical Signals */}
      {criticalSignals && criticalSignals.length > 0 ? (
        <div className="space-y-3 mb-6">
          <div className="text-sm text-gray-400 mb-2">Critical Signals</div>
          {criticalSignals.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-white font-medium text-sm">{item.outcome.name}</div>
                  <div className="text-gray-400 text-xs">{item.department.name}</div>
                </div>
                <span className="text-red-400 font-bold text-sm">
                  {item.signal.value?.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-red-300">{item.signal.name}</div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm mb-6">
          No critical signals
        </div>
      )}
      
      {/* Warning Signals */}
      {warningSignals && warningSignals.length > 0 && (
        <>
          <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-yellow-400" />
            Warning Signals
          </div>
          <div className="space-y-2">
            {warningSignals.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (criticalSignals?.length || 0) * 0.1 + index * 0.1 }}
                className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="text-white font-medium text-sm">{item.outcome.name}</div>
                    <div className="text-gray-400 text-xs">{item.department.name}</div>
                  </div>
                  <span className="text-yellow-400 font-bold text-sm">
                    {item.signal.value?.toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-yellow-300">{item.signal.name}</div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AlertPanel;