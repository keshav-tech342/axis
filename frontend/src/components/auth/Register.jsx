import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building2, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import authService from '../../services/authService';

const Register = ({ onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const validatePassword = (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain a number';
    return true;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.register(data);
      localStorage.setItem('access_token', response.data.tokens.access_token);
      localStorage.setItem('refresh_token', response.data.tokens.refresh_token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(password);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      
      {/* 3D Floating Shapes */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mix-blend-multiply filter blur-2xl opacity-30 transform-gpu"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Glassmorphism Card with 3D Mouse Tilt */}
          <motion.div
            className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 transform-gpu"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
              const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            }}
          >
            {/* Logo */}
            <motion.div className="text-center mb-6" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-3 shadow-lg shadow-blue-500/50">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-gray-300 text-sm">Join AXIS and transform your workflow</p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" {...register('full_name', { required: 'Name is required' })} placeholder="John Doe" className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                {errors.full_name && <p className="mt-1 text-xs text-red-300">{errors.full_name.message}</p>}
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="email" {...register('email', { required: 'Email is required' })} placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}
              </motion.div>

              {/* Organization */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-medium text-gray-200 mb-2">Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" {...register('organization_name', { required: 'Organization name is required' })} placeholder="Acme Corp" className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                {errors.organization_name && <p className="mt-1 text-xs text-red-300">{errors.organization_name.message}</p>}
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="password" {...register('password', { validate: validatePassword })} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>}

                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div key={level} className={`h-1 flex-1 rounded-full transition-all ${
                          level <= strength
                            ? strength <= 2
                              ? 'bg-red-500'
                              : strength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-white/20'
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-300">
                      Strength: {strength <= 2 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong'}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-blue-500/75 transition-all duration-300 flex items-center justify-center group disabled:opacity-50 mt-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Create Account
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign In */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-xs text-gray-400">or</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>
            <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <p className="text-gray-300 text-sm">
                Already have an account?{' '}
                <button onClick={onToggle} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign in
                </button>
              </p>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.p className="text-center text-gray-400 text-xs mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            By signing up, you agree to our Terms & Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
