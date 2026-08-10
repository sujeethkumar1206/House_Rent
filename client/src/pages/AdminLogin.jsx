import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth.js';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('admin@houserent.com');
    setPassword('Admin@12345');
    toast.info('Demo admin credentials filled!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      if (user.role !== 'Admin') {
        toast.error('Access Denied: This account is not an Administrator.');
        return;
      }
      toast.success('Admin login successful! Welcome to the Admin Portal.');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="bg-dark text-white p-4 text-center">
              <div className="fs-1 mb-2">🔐</div>
              <h3 className="fw-bold mb-1">Admin Portal</h3>
              <p className="text-muted small mb-0">HouseRent Administrative Management</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <button
                type="button"
                className="btn btn-outline-primary w-100 mb-4 py-2 fw-semibold border-2 d-flex align-items-center justify-content-center gap-2"
                onClick={handleFillDemo}
              >
                <span>⚡</span> Quick Fill Demo Admin Credentials
              </button>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Admin Email</label>
                  <input
                    type="email"
                    className="form-control form-control-lg fs-6"
                    placeholder="admin@houserent.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg fs-6"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-3 fw-bold btn-lg fs-6"
                  disabled={submitting}
                >
                  {submitting ? 'Authenticating...' : 'Sign In to Admin Portal'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-secondary text-decoration-none small">
                  ← Back to Regular User Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
