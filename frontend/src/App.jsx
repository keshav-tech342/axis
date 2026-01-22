import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import ProtectedRoute from './components/ProtectedRoute';
import DepartmentDetail from './pages/DepartmentDetail';
import Activities from './pages/Activities';


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

      <Route path="/departments" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Departments />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/activities" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Activities />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/departments/:id" element={
       <ProtectedRoute>
         <DashboardLayout>
           <DepartmentDetail />
          </DashboardLayout>
      </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;