import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../../api/index.js';
import { Card, Badge, Alert, Table, Pagination } from '../../components/UI.jsx';

export default function TeamMembers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await usersAPI.getAll({ page, limit: 10, search, role: 'user' });
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(1), 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const columns = [
    {
      key: 'name', label: 'Member',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'is_active', label: 'Status',
      render: (row) => <Badge variant={row.is_active ? 'success' : 'danger'}>{row.is_active ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'created_at', label: 'Joined',
      render: (row) => <span className="text-xs text-slate-500">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
        <p className="text-sm text-slate-500 mt-1">{pagination.total} members in your team</p>
      </div>

      <Alert message={error} type="error" />

      <Card className="p-4">
        <input
          type="text" placeholder="Search members…"
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Card>

      <Card>
        <Table columns={columns} data={users} loading={loading} emptyMessage="No team members found" />
        <div className="px-4 pb-4">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchUsers} />
        </div>
      </Card>
    </div>
  );
}
