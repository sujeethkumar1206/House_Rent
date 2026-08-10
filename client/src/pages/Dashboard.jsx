import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyProperties, deleteProperty } from '../services/propertyService.js';
import { getBookings } from '../services/bookingService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import useAuth from '../hooks/useAuth.js';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({ asTenant: 0, asOwner: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleLogout = async () => {
    await logout();
    toast.info('You have been logged out');
    navigate('/login');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propRes, bookRes] = await Promise.all([getMyProperties(), getBookings()]);
      setProperties(propRes.data.properties);
      setBookingCounts({
        asTenant: bookRes.data.asTenant.length,
        asOwner: bookRes.data.asOwner.length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteProperty(deleteTarget);
      toast.success('Property deleted');
      setProperties((prev) => prev.filter((p) => p._id !== deleteTarget));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete property');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="mb-0">Welcome, {user?.fullname?.split(' ')[0]}</h3>
        <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card dashboard-card p-3">
            <h6 className="text-muted">My Properties</h6>
            <h3>{properties.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-3">
            <h6 className="text-muted">My Bookings (as tenant)</h6>
            <h3>{bookingCounts.asTenant}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-3">
            <h6 className="text-muted">Booking Requests (as owner)</h6>
            <h3>{bookingCounts.asOwner}</h3>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">My Property Listings</h5>
        <Link to="/properties/add" className="btn btn-brand btn-sm">+ Add Property</Link>
      </div>

      <div className="table-responsive">
        <table className="table align-middle bg-white shadow-sm rounded">
          <thead>
            <tr>
              <th>Title</th>
              <th>City</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.city}</td>
                <td>₹{p.price?.toLocaleString()}</td>
                <td><span className={`badge status-badge-${p.status}`}>{p.status}</span></td>
                <td>
                  <Link to={`/properties/${p._id}`} className="btn btn-sm btn-outline-primary me-2">View</Link>
                  <Link to={`/properties/edit/${p._id}`} className="btn btn-sm btn-outline-secondary me-2">Edit</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr><td colSpan="5" className="text-center text-muted py-4">You haven't listed any properties yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Property"
        message="Are you sure you want to delete this property listing? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Delete"
      />
    </div>
  );
};

export default Dashboard;
