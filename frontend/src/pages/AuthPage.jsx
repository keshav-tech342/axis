import { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950">
      
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 -left-1/3 h-[40rem] w-[40rem] rounded-full bg-purple-600/30 blur-[140px]" />
        <div className="absolute -bottom-1/3 -right-1/3 h-[40rem] w-[40rem] rounded-full bg-blue-600/30 blur-[140px]" />
      </div>

      {/* Centered auth card */}
      <div className="flex min-h-screen items-center justify-center px-4">
        {showLogin ? (
          <Login onToggle={() => setShowLogin(false)} />
        ) : (
          <Register onToggle={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
