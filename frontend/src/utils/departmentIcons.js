import { 
  Crown, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Settings, 
  Heart,
  Target,
  Lightbulb,
  Shield,
  Rocket,
  Folder
} from 'lucide-react';

export const departmentIcons = {
  'crown': Crown,
  'dollar-sign': DollarSign,
  'users': Users,
  'trending-up': TrendingUp,
  'settings': Settings,
  'heart': Heart,
  'target': Target,
  'lightbulb': Lightbulb,
  'shield': Shield,
  'rocket': Rocket,
  'folder': Folder
};

export const departmentColors = {
  'leadership': 'from-purple-500 to-pink-500',
  'finance': 'from-green-500 to-emerald-500',
  'people': 'from-blue-500 to-cyan-500',
  'sales': 'from-orange-500 to-red-500',
  'operations': 'from-slate-500 to-gray-500',
  'customer': 'from-rose-500 to-pink-500',
  'strategy': 'from-violet-500 to-purple-500',
  'product': 'from-indigo-500 to-blue-500',
  'risk': 'from-yellow-500 to-orange-500',
  'growth': 'from-teal-500 to-green-500',
  'custom': 'from-gray-500 to-slate-500'
};

export const getDepartmentIcon = (iconName) => {
  return departmentIcons[iconName] || Folder;
};

export const getDepartmentColor = (type) => {
  return departmentColors[type] || departmentColors['custom'];
};