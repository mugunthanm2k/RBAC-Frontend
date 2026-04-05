import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/index.js';
import { Button, Input, Select, Alert } from '../components/UI.jsx';

const validate = (form) => {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Name is required';
  else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
  if (!form.email) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
  if (!form.password) errs.password = 'Password is required';
  else if (form.password.length < 8) errs.password = 'Minimum 8 characters';
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
    errs.password = 'Must include uppercase, lowercase & number';
  if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
  return errs;
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
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
      await authAPI.register({ name: form.name, email: form.email, password: form.password, role: form.role });
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z\d]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-600'][strength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-indigo-600/30">R</div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Join RBAC System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {success && <Alert message={success} type="success" />}
          {apiError && <Alert message={apiError} type="error" onClose={() => setApiError('')} />}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input id="name" name="name" label="Full Name" placeholder="John Doe"
              value={form.name} onChange={handleChange} error={errors.name} required />

            <Input id="email" name="email" type="email" label="Email Address"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} error={errors.email} required />

            <Select id="role" name="role" label="Role" value={form.role} onChange={handleChange}
              options={[
                { value: 'user', label: 'User' },
                { value: 'manager', label: 'Manager' },
                { value: 'admin', label: 'Admin' },
              ]}
            />

            <div>
              <Input id="password" name="password" type="password" label="Password"
                placeholder="••••••••" value={form.password}
                onChange={handleChange} error={errors.password} required />
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{strengthLabel}</p>
                </div>
              )}
            </div>

            <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password"
              placeholder="••••••••" value={form.confirmPassword}
              onChange={handleChange} error={errors.confirmPassword} required />

            <Button type="submit" loading={loading} disabled={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
