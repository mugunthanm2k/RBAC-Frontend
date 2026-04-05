import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Spinner shown while verifying token
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">Verifying session…</p>
    </div>
  </div>
);

// Requires login
export const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner />;
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

// Requires specific role(s)
export const RoleRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
};

// Redirect logged-in users away from login page
export const GuestRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) {
    const redirectMap = { admin: '/admin', manager: '/manager', user: '/dashboard' };
    return <Navigate to={redirectMap[user.role] || '/dashboard'} replace />;
  }
  return <Outlet />;
};
