import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../api/index.js';
import { StatCard, Card, Badge, Alert } from '../../components/UI.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    usersAPI.getStats()
      .then((r) => setStats(r.data.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const roleCount = (role) =>
    stats?.roleStats?.find((r) => r.role === role)?.count ?? 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Full system overview — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Alert message={error} type="error" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={loading ? '—' : stats?.activeStats?.total ?? 0} icon="👥" color="indigo" />
        <StatCard label="Active Users" value={loading ? '—' : stats?.activeStats?.active ?? 0} icon="✅" color="emerald" />
        <StatCard label="Managers" value={loading ? '—' : roleCount('manager')} icon="🏢" color="blue" />
        <StatCard label="Admins" value={loading ? '—' : roleCount('admin')} icon="🔑" color="purple" />
      </div>

      {/* Role breakdown + Recent users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role breakdown */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Role Distribution</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {stats?.roleStats?.map((r) => {
                const total = stats.activeStats.total || 1;
                const pct = Math.round((r.count / total) * 100);
                const colors = { admin: 'bg-purple-500', manager: 'bg-blue-500', user: 'bg-emerald-500' };
                return (
                  <div key={r.role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium text-slate-700">{r.role}</span>
                      <span className="text-slate-500">{r.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${colors[r.role] || 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">Recent Users</h2>
            <Link to="/admin/users" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2">
              {stats?.recentUsers?.map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <Badge variant={u.role}>{u.role}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
            👥 Manage Users
          </Link>
          <Link to="/admin/audit-logs" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            📋 View Audit Logs
          </Link>
          <Link to="/admin/profile" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            👤 My Profile
          </Link>
        </div>
      </Card>
    </div>
  );
}
