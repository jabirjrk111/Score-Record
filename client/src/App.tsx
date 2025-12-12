import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { useAuth, AuthProvider } from './context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // Or unauthorized page
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/teacher/*"
        element={
          <PrivateRoute roles={['teacher', 'admin']}>
            <TeacherDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <PrivateRoute roles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="font-sans text-gray-900 antialiased">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
