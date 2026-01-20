import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  Users,
  Settings,
  Plus,
  BarChart3
} from 'lucide-react';
import departmentService from '../services/departmentService';
import { getDepartmentIcon, getDepartmentColor } from '../utils/departmentIcons';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getById(id);
      if (response?.data) {
        setDepartment(response.data);
      }
    } catch (err) {
      setError('Failed to load department');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="p-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 text-xl mb-4">{error || 'Department not found'}</p>
          <button
            onClick={() => navigate('/departments')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all"
          >
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  const Icon = getDepartmentIcon(department.icon);
  const colorClass = getDepartmentColor(department.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/departments')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Departments
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{department.name}</h1>
              <p className="text-gray-400">{department.description || 'No description'}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: 'Outcomes', value: department.outcome_count || 0, color: 'blue' },
          { icon: Activity, label: 'Activities', value: department.activity_count || 0, color: 'purple' },
          { icon: AlertTriangle, label: 'Critical Signals', value: department.critical_signals || 0, color: 'red' },
          { icon: Users, label: 'Team Members', value: '8', color: 'green' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs Section */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4">
          <div className="flex gap-6">
            {['Outcomes', 'Activities', 'Team', 'Analytics'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium transition-all ${
                  tab === 'Outcomes'
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Coming Soon Message */}
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Outcomes & Signals Coming Soon!
            </h3>
            <p className="text-gray-400 mb-6">
              We'll build the outcomes, activities, and analytics in Sprint 2
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg mx-auto">
              <Plus className="w-5 h-5" />
              Create Outcome
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;