import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🏠 HouseRent
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/properties">Properties</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-primary fw-semibold" to="/admin/login">🔐 Admin Portal</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-brand btn-sm ms-2 mt-1" to="/register">Register</Link>
                </li>
              </>
            )}
            {user && (
              <>
                {isAdmin ? (
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark border border-dark rounded-pill px-3 py-1 mt-1 me-2" to="/admin">👑 Admin Portal</Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    {user.fullname?.split(' ')[0]}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                    {isAdmin && (
                      <li><Link className="dropdown-item fw-semibold text-primary" to="/admin">👑 Admin Dashboard</Link></li>
                    )}
                    <li><Link className="dropdown-item" to="/bookings">My Bookings</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    {isAdmin && (
                      <li>
                        <button className="dropdown-item text-danger fw-semibold" onClick={async () => { await logout(); navigate('/admin/login'); }}>
                          🚪 Logout Admin Session
                        </button>
                      </li>
                    )}
                    <li>
                      <button className="dropdown-item text-danger fw-semibold" onClick={handleLogout}>🚪 Logout</button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
