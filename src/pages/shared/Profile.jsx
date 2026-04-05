import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authAPI } from '../../api/index.js';
import { Card, Button, Input, Alert, Badge } from '../../components/UI.jsx';

const validatePassword = (f) => {
  const e = {};
  if (!f.currentPassword) e.currentPassword = 'Required';
  if (!f.newPassword) e.newPassword = 'Required';
  else if (f.newPassword.length < 8) e.newPassword = 'Min 8 characters';
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(f.newPassword)) e.newPassword = 'Upper, lower & number needed';
  if (f.newPassword !== f.confirmPassword) e.confirmPassword = 'Passwords do not match';
  return e;
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = validatePassword(pwForm);
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    try {
      await authAPI.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const roleBadgeVariant = { admin: 'admin', manager: 'manager', user: 'user' };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account settings</p>
      </div>

      {/* Profile Info */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <Badge variant={roleBadgeVariant[user?.role]} className="mt-1">{user?.role}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Full Name</p>
            <p className="text-slate-800 mt-1">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Email Address</p>
            <p className="text-slate-800 mt-1">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Role</p>
            <p className="text-slate-800 mt-1 capitalize">{user?.role}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Account Status</p>
            <p className="text-emerald-600 mt-1 font-medium">Active</p>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Change Password</h2>

        {pwSuccess && <Alert message={pwSuccess} type="success" onClose={() => setPwSuccess('')} />}
        {pwError && <Alert message={pwError} type="error" onClose={() => setPwError('')} />}

        <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
          <Input
            id="currentPassword" type="password" label="Current Password"
            placeholder="••••••••"
            value={pwForm.currentPassword}
            onChange={(e) => { setPwForm(f => ({ ...f, currentPassword: e.target.value })); setPwErrors(p => ({ ...p, currentPassword: '' })); }}
            error={pwErrors.currentPassword}
            required
          />
          <Input
            id="newPassword" type="password" label="New Password"
            placeholder="••••••••"
            value={pwForm.newPassword}
            onChange={(e) => { setPwForm(f => ({ ...f, newPassword: e.target.value })); setPwErrors(p => ({ ...p, newPassword: '' })); }}
            error={pwErrors.newPassword}
            required
          />
          <Input
            id="confirmPassword" type="password" label="Confirm New Password"
            placeholder="••••••••"
            value={pwForm.confirmPassword}
            onChange={(e) => { setPwForm(f => ({ ...f, confirmPassword: e.target.value })); setPwErrors(p => ({ ...p, confirmPassword: '' })); }}
            error={pwErrors.confirmPassword}
            required
          />
          <div className="pt-1">
            <Button type="submit" loading={pwLoading} disabled={pwLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
