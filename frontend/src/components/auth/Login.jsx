import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, ChevronRight, Zap } from 'lucide-react';
import authService from '../../services/authService';

const Login = ({ onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(data);
      localStorage.setItem('access_token', response.data.tokens.access_token);
      localStorage.setItem('refresh_token', response.data.tokens.refresh_token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      {/* Floating 3D Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <div className="w-1 h-1 bg-white rounded-full shadow-glow"></div>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md perspective-1000"
        >
          {/* 3D Glassmorphism Card */}
          <motion.div
            className="relative backdrop-blur-2xl bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10"
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 100px rgba(255, 255, 255, 0.05)'
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 30px 60px -15px rgba(139, 92, 246, 0.5), inset 0 0 100px rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-xl -z-10"></div>

            {/* Logo with 3D Effect */}
            <motion.div
              className="text-center mb-8"
              initial={{ scale: 0.5, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl mb-4 relative"
                style={{
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)'
                }}
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Sparkles className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute inset-0 bg-white rounded-2xl"
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
              
              <motion.h1 
                className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              >
                AXIS
              </motion.h1>
              <p className="text-gray-300 text-sm">Central Intelligence System</p>
            </motion.div>

            {/* Welcome Text with Floating Effect */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Welcome Back
              </h2>
              <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
            </motion.div>

            {/* Error Message with Slide Effect */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input with 3D Effect */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all focus:bg-white/10"
                    placeholder="you@example.com"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity"
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-300"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Input with 3D Effect */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all focus:bg-white/10"
                    placeholder="••••••••"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity"
                  />
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-300"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {/* 3D Animated Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold rounded-xl overflow-hidden group disabled:opacity-50"
                style={{
                  boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)'
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 15px 40px rgba(139, 92, 246, 0.6)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Button Content */}
                <div className="relative flex items-center justify-center">
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>

            {/* Sign Up Link */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={onToggle}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors relative group"
                >
                  Sign up for free
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all"></span>
                </button>
              </p>
            </motion.div>
          </motion.div>

          {/* Footer with Glow Effect */}
          <motion.p
            className="text-center text-gray-500 text-xs mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            © 2026 AXIS. Powered by Intelligence.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;