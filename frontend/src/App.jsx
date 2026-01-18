import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const token = localStorage.getItem('access_token');

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <AuthPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;