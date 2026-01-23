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
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import departmentService from '../services/departmentService';
import { getDepartmentIcon, getDepartmentColor } from '../utils/departmentIcons';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [outcomes, setOutcomes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Outcomes');

  useEffect(() => {
    fetchDepartmentData();
  }, [id]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getById(id);
      if (response?.data) {
        setDepartment(response.data);
        // Fetch outcomes and activities for this department
        await fetchOutcomes();
        await fetchActivities();
      }
    } catch (err) {
      setError('Failed to load department');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOutcomes = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/departments/${id}/outcomes`);
      if (response.ok) {
        const data = await response.json();
        setOutcomes(data);
      }
    } catch (err) {
      console.error('Error fetching outcomes:', err);
      setOutcomes([]);
    }
  };

  const fetchActivities = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/departments/${id}/activities`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivities([]);
    }
  };

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
          { icon: TrendingUp, label: 'Outcomes', value: outcomes.length, color: 'blue' },
          { icon: Activity, label: 'Activities', value: activities.length, color: 'purple' },
          { icon: AlertTriangle, label: 'Critical Signals', value: outcomes.filter(o => o.status === 'off track').length, color: 'red' },
          { icon: Users, label: 'Team Members', value: department.team_count || 0, color: 'green' },
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
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-all ${
                  tab === activeTab
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
          {/* Outcomes Tab */}
          {activeTab === 'Outcomes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Outcomes</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-5 h-5" />
                  Create Outcome
                </button>
              </div>

              {outcomes.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Outcomes Yet</h3>
                  <p className="text-gray-400 mb-6">Create your first outcome to start tracking progress</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {outcomes.map((outcome, index) => (
                    <motion.div
                      key={outcome.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => navigate(`/outcomes/${outcome.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">{outcome.name}</h3>
                          <p className="text-gray-400 text-sm mb-4">{outcome.description}</p>
                          
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(outcome.status)}`}>
                              {getStatusIcon(outcome.status)}
                              <span className="text-sm font-medium">{outcome.status || 'Not Started'}</span>
                            </div>
                            
                            {outcome.target_date && (
                              <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>Due {new Date(outcome.target_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {outcome.progress !== undefined && (
                          <div className="ml-6">
                            <div className="text-right mb-2">
                              <span className="text-2xl font-bold text-white">{outcome.progress}%</span>
                            </div>
                            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                                style={{ width: `${outcome.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'Activities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Activities</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-5 h-5" />
                  Create Activity
                </button>
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Activities Yet</h3>
                  <p className="text-gray-400 mb-6">Create your first activity to start tracking work</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-semibold mb-1">{activity.name}</h4>
                          <p className="text-gray-400 text-sm">{activity.description}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                          <span className="text-sm font-medium">{activity.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'Team' && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Team Management</h3>
              <p className="text-gray-400">Team features coming in Sprint 2</p>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'Analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
              <p className="text-gray-400">Analytics features coming in Sprint 2</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
