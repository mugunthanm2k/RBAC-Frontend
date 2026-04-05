import { useAuth } from '../../context/AuthContext.jsx';
import { Card, Badge } from '../../components/UI.jsx';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();

  const permissions = {
    user: ['View personal dashboard', 'Update own profile', 'Change password'],
    manager: ['View team members', 'Access team reports', 'Manage user accounts', '+ User permissions'],
    admin: ['Full system access', 'Manage all users', 'View audit logs', 'Create/delete accounts', '+ Manager & User permissions'],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Welcome card */}
      <Card className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 border-indigo-500">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold text-white shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="text-indigo-200 text-sm">Welcome back</p>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-indigo-300 text-sm mt-1">{user?.email}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account info */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Name</span>
              <span className="text-sm font-medium text-slate-800">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-800">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Role</span>
              <Badge variant={user?.role}>{user?.role}</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">Status</span>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
          <Link to="/dashboard/profile" className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Edit Profile →
          </Link>
        </Card>

        {/* Permissions */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Your Permissions</h2>
          <div className="space-y-2">
            {(permissions[user?.role] || permissions.user).map((perm, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-emerald-500">✓</span>
                {perm}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
