import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../../api/index.js';
import {
  Button, Badge, Alert, Modal, Input, Select, Table, Pagination, Card
} from '../../components/UI.jsx';

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
];

const emptyForm = { name: '', email: '', password: '', role: 'user' };

const validateCreate = (f) => {
  const e = {};
  if (!f.name.trim()) e.name = 'Name required';
  if (!f.email) e.email = 'Email required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Valid email required';
  if (!f.password) e.password = 'Password required';
  else if (f.password.length < 8) e.password = 'Min 8 characters';
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(f.password)) e.password = 'Upper, lower & number needed';
  return e;
};

const validateEdit = (f) => {
  const e = {};
  if (f.name && f.name.length < 2) e.name = 'Min 2 characters';
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Valid email required';
  return e;
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await usersAPI.getAll({ page, limit: 10, search, role: roleFilter });
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(1), 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const errs = validateCreate(createForm);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await usersAPI.create(createForm);
      setSuccess('User created successfully');
      setCreateModal(false);
      setCreateForm(emptyForm);
      fetchUsers(1);
    } catch (err) {
      setFormErrors({ api: err.response?.data?.message || 'Create failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, is_active: user.is_active });
    setFormErrors({});
    setEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const errs = validateEdit(editForm);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await usersAPI.update(selectedUser.id, editForm);
      setSuccess('User updated successfully');
      setEditModal(false);
      fetchUsers(pagination.page);
    } catch (err) {
      setFormErrors({ api: err.response?.data?.message || 'Update failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await usersAPI.delete(selectedUser.id);
      setSuccess('User deleted successfully');
      setDeleteModal(false);
      fetchUsers(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
      setDeleteModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'name', label: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Role', render: (row) => <Badge variant={row.role}>{row.role}</Badge> },
    {
      key: 'is_active', label: 'Status',
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'danger'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at', label: 'Joined',
      render: (row) => <span className="text-xs text-slate-500">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => { setSelectedUser(row); setDeleteModal(true); }}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">{pagination.total} total users</p>
        </div>
        <Button onClick={() => { setCreateForm(emptyForm); setFormErrors({}); setCreateModal(true); }}>
          + Add User
        </Button>
      </div>

      {success && <Alert message={success} type="success" onClose={() => setSuccess('')} />}
      {error && <Alert message={error} type="error" onClose={() => setError('')} />}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text" placeholder="Search by name or email…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table columns={columns} data={users} loading={loading} emptyMessage="No users found" />
        <div className="px-4 pb-4">
          <Pagination page={pagination.page} totalPages={pagination.totalPages}
            onPageChange={(p) => fetchUsers(p)} />
        </div>
      </Card>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New User">
        {formErrors.api && <Alert message={formErrors.api} type="error" />}
        <form onSubmit={handleCreate} className="space-y-4 mt-3">
          <Input label="Full Name" value={createForm.name} onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))} error={formErrors.name} required />
          <Input label="Email" type="email" value={createForm.email} onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))} error={formErrors.email} required />
          <Input label="Password" type="password" value={createForm.password} onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))} error={formErrors.password} required />
          <Select label="Role" value={createForm.role} onChange={(e) => setCreateForm(f => ({ ...f, role: e.target.value }))} options={ROLE_OPTIONS} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={submitting} className="flex-1">Create User</Button>
            <Button variant="secondary" onClick={() => setCreateModal(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title={`Edit: ${selectedUser?.name}`}>
        {formErrors.api && <Alert message={formErrors.api} type="error" />}
        <form onSubmit={handleEdit} className="space-y-4 mt-3">
          <Input label="Full Name" value={editForm.name || ''} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} error={formErrors.name} />
          <Input label="Email" type="email" value={editForm.email || ''} onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))} error={formErrors.email} />
          <Select label="Role" value={editForm.role || 'user'} onChange={(e) => setEditForm(f => ({ ...f, role: e.target.value }))} options={ROLE_OPTIONS} />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <button
              type="button"
              onClick={() => setEditForm(f => ({ ...f, is_active: !f.is_active }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${editForm.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${editForm.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-slate-500">{editForm.is_active ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={submitting} className="flex-1">Save Changes</Button>
            <Button variant="secondary" onClick={() => setEditModal(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Confirm Delete">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto">⚠️</div>
          <p className="text-slate-700">
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" loading={submitting} onClick={handleDelete} className="flex-1">Delete</Button>
            <Button variant="secondary" onClick={() => setDeleteModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
