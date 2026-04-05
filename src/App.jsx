import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { PrivateRoute, RoleRoute, GuestRoute } from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { Unauthorized, NotFound } from './pages/ErrorPages.jsx';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import AuditLogs from './pages/admin/AuditLogs.jsx';

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard.jsx';
import TeamMembers from './pages/manager/TeamMembers.jsx';

// User pages
import UserDashboard from './pages/user/UserDashboard.jsx';

// Shared pages
import Profile from './pages/shared/Profile.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes (redirect if logged in) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Admin routes */}
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route element={<Layout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
              <Route path="/admin/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Manager routes */}
          <Route element={<RoleRoute roles={['manager']} />}>
            <Route element={<Layout />}>
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/manager/users" element={<TeamMembers />} />
              <Route path="/manager/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* User routes */}
          <Route element={<RoleRoute roles={['user']} />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Error pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
