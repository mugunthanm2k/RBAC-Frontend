import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Input, Alert } from '../components/UI.jsx';

const validate = (form) => {
  const errs = {};
  if (!form.email) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
  if (!form.password) errs.password = 'Password is required';
  return errs;
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const user = await login(form.email, form.password);
      const redirectMap = { admin: '/admin', manager: '/manager', user: '/dashboard' };
      navigate(from || redirectMap[user.role] || '/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const demos = {
      admin: { email: 'admin@rbac.com', password: 'Admin@123' },
      manager: { email: 'manager@rbac.com', password: 'Manager@123' },
      user: { email: 'user@rbac.com', password: 'User@1234' },
    };
    setForm(demos[role]);
    setErrors({});
    setApiError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-indigo-600/30">
            R
          </div>
          <h1 className="text-2xl font-bold text-white">RBAC System</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Alert message={apiError} type="error" onClose={() => setApiError('')} />

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <Input
              id="email" name="email" type="email" label="Email Address"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} error={errors.email} required autoFocus
            />
            <Input
              id="password" name="password" type="password" label="Password"
              placeholder="••••••••" value={form.password}
              onChange={handleChange} error={errors.password} required
            />
            <Button type="submit" loading={loading} disabled={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          {/* Demo logins */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center mb-3 font-medium">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {['admin', 'manager', 'user'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200
                    text-slate-600 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600
                    transition-all capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-4">
            No account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
