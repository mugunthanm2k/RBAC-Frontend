import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/UI.jsx';

export function Unauthorized() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const homeMap = { admin: '/admin', manager: '/manager', user: '/dashboard' };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-slide-up">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500 mb-6">
          You don't have permission to view this page. Contact your administrator if you think this is a mistake.
        </p>
        <Button onClick={() => navigate(homeMap[user?.role] || '/login')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-slide-up">
        <div className="text-8xl font-black text-slate-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}
