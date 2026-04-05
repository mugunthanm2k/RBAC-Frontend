import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../api/index.js';
import { StatCard, Card, Badge, Alert } from '../../components/UI.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [teamData, setTeamData] = useState({ users: [], pagination: { total: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    usersAPI.getAll({ page: 1, limit: 5, role: 'user' })
      .then((r) => setTeamData(r.data.data))
      .catch(() => setError('Failed to load team data'))
      .finally(() => setLoading(false));
  }, []);

  const activeCount = teamData.users.filter((u) => u.is_active).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manager Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Team overview — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Alert message={error} type="error" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Team Members" value={loading ? '—' : teamData.pagination.total} icon="👥" color="blue" />
        <StatCard label="Active Members" value={loading ? '—' : activeCount} icon="✅" color="emerald" />
        <StatCard label="Your Role" value="Manager" icon="🏢" color="indigo" />
      </div>

      {/* Team members */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Recent Team Members</h2>
          <Link to="/manager/users" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded animate-pulse" />)}</div>
        ) : teamData.users.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No team members yet</p>
        ) : (
          <div className="space-y-2">
            {teamData.users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <Badge variant={u.is_active ? 'success' : 'danger'}>
                  {u.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Info box */}
      <Card className="p-6 bg-blue-50 border-blue-100">
        <div className="flex items-start gap-4">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-semibold text-blue-800">Manager Permissions</h3>
            <p className="text-sm text-blue-600 mt-1">
              You can view and manage team members (users). For admin-level changes like creating managers or accessing audit logs, contact your system administrator.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
