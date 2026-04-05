import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
    { to: '/admin/users', label: 'User Management', icon: '👥' },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' },
    { to: '/admin/profile', label: 'Profile', icon: '👤' },
  ],
  manager: [
    { to: '/manager', label: 'Dashboard', icon: '▦', end: true },
    { to: '/manager/users', label: 'Team Members', icon: '👥' },
    { to: '/manager/profile', label: 'Profile', icon: '👤' },
  ],
  user: [
    { to: '/dashboard', label: 'Dashboard', icon: '▦', end: true },
    { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ],
};

const roleMeta = {
  admin: { label: 'Administrator', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  manager: { label: 'Manager', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  user: { label: 'User', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const items = navItems[user?.role] || navItems.user;
  const meta = roleMeta[user?.role] || roleMeta.user;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <aside className="h-full flex flex-col bg-slate-900 text-white">

      {/* User Info */}
      <div className="px-4 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-semibold text-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">
              Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${meta.dot} animate-pulse`} />
            <span className="text-xs text-slate-500">{meta.label}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
