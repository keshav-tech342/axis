    import { Shield, User, Crown, Briefcase, Settings } from 'lucide-react';

const RoleBadge = ({ role, size = 'md' }) => {
  const getRoleIcon = (type) => {
    switch (type) {
      case 'admin': return <Settings className="w-4 h-4" />;
      case 'decision_maker': return <Crown className="w-4 h-4" />;
      case 'owner': return <Briefcase className="w-4 h-4" />;
      case 'contributor': return <User className="w-4 h-4" />;
      case 'observer': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (type) => {
    switch (type) {
      case 'admin': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'decision_maker': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'owner': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'contributor': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'observer': return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border font-medium ${getRoleColor(role.type)} ${sizeClasses[size]}`}>
      {getRoleIcon(role.type)}
      <span>{role.name}</span>
    </span>
  );
};

export default RoleBadge;