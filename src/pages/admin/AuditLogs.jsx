import { useState, useEffect } from 'react';
import { usersAPI } from '../../api/index.js';
import { Card, Badge, Alert, Pagination, Table } from '../../components/UI.jsx';

const actionColor = (action) => {
  if (action.includes('DELETE')) return 'danger';
  if (action.includes('CREATE')) return 'success';
  if (action.includes('UPDATE')) return 'warning';
  if (action === 'LOGIN') return 'user';
  return 'default';
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await usersAPI.getAuditLogs({ page, limit: 20 });
      setLogs(res.data.data.logs);
      setPagination(res.data.data.pagination);
    } catch {
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const columns = [
    {
      key: 'user', label: 'User',
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-slate-800">{row.user_name || 'System'}</p>
          <p className="text-xs text-slate-400">{row.user_email || '—'}</p>
        </div>
      ),
    },
    {
      key: 'action', label: 'Action',
      render: (row) => <Badge variant={actionColor(row.action)}>{row.action}</Badge>,
    },
    { key: 'details', label: 'Details', render: (row) => <span className="text-xs text-slate-600">{row.details}</span> },
    { key: 'ip_address', label: 'IP', render: (row) => <span className="text-xs font-mono text-slate-500">{row.ip_address}</span> },
    {
      key: 'created_at', label: 'Time',
      render: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.created_at).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">{pagination.total} total events recorded</p>
      </div>

      <Alert message={error} type="error" />

      <Card>
        <Table columns={columns} data={logs} loading={loading} emptyMessage="No audit logs found" />
        <div className="px-4 pb-4">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchLogs} />
        </div>
      </Card>
    </div>
  );
}
