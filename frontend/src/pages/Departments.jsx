import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Grid3x3, List, Sparkles } from 'lucide-react';
import DepartmentCard from '../components/departments/DepartmentCard';
import departmentService from '../services/departmentService';

const Departments = () => {
  const [departments, setDepartments] = useState([]); // ✅ Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const response = await departmentService.getAll({ include_stats: 'true' });
      
      // ✅ Safely access the departments array
      if (response?.data?.departments) {
        setDepartments(response.data.departments);
      } else {
        setDepartments([]); // Fallback to empty array
      }
    } catch (err) {
      setError('Failed to load departments');
      console.error('Error fetching departments:', err);
      setDepartments([]); // ✅ Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe filtering - only filter if departments is an array
  const filteredDepartments = Array.isArray(departments) 
    ? departments.filter(dept => {
        const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || dept.type === filterType;
        return matchesSearch && matchesFilter;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            Departments
          </h1>
          <p className="text-gray-400">
            Manage and monitor all organizational departments
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Department
          <span className="ml-2 px-2 py-0.5 bg-yellow-500/30 text-yellow-200 text-xs rounded-full">
            Premium
          </span>
        </motion.button>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="leadership">Leadership</option>
                <option value="finance">Finance</option>
                <option value="people">People</option>
                <option value="sales">Sales</option>
                <option value="operations">Operations</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-purple-500/30 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-purple-500/30 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || filterType !== 'all') && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
            {filterType !== 'all' && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                Type: {filterType}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Clear all
            </button>
          </div>
        )}
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-red-500/20 border border-red-500/30 rounded-2xl text-center"
        >
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchDepartments}
            className="px-6 py-2 bg-red-500/30 hover:bg-red-500/40 text-red-200 rounded-xl transition-all"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Departments Grid */}
      {!loading && !error && (
        <>
          {filteredDepartments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl"
            >
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No departments found</p>
              <p className="text-gray-500 text-sm mt-2">
                {departments.length === 0 
                  ? 'Loading departments...' 
                  : 'Try adjusting your search or filters'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              <AnimatePresence>
                {filteredDepartments.map((department, index) => (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Stats Summary */}
          {departments.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-white">{departments.length}</p>
                  <p className="text-sm text-gray-400">Total Departments</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">
                    {departments.filter(d => d.is_default).length}
                  </p>
                  <p className="text-sm text-gray-400">Default</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">
                    {departments.filter(d => d.is_custom).length}
                  </p>
                  <p className="text-sm text-gray-400">Custom</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">
                    {departments.reduce((sum, d) => sum + (d.critical_signals || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-400">Critical Signals</p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Departments;