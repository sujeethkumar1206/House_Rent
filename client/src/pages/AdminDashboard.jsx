import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import * as adminService from '../services/adminService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import useAuth from '../hooks/useAuth.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const exportToCSV = (filename, rows) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) =>
        keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator)
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [monthlyProperties, setMonthlyProperties] = useState([]);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [properties, setProperties] = useState([]);
  const [propertySearch, setPropertySearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);
  const [deletePropertyTarget, setDeletePropertyTarget] = useState(null);
  const [propertyFilter, setPropertyFilter] = useState('Pending');

  const fetchOverview = async () => {
    const res = await adminService.getDashboard();
    setStats(res.data.stats);
    const propChart = MONTHS.map((_, idx) => {
      const found = res.data.monthlyProperties.find((m) => m._id === idx + 1);
      return found ? found.count : 0;
    });
    const bookChart = MONTHS.map((_, idx) => {
      const found = (res.data.monthlyBookings || []).find((m) => m._id === idx + 1);
      return found ? found.count : 0;
    });
    setMonthlyProperties(propChart);
    setMonthlyBookings(bookChart);
  };

  const fetchUsers = async () => {
    const res = await adminService.getUsers(userSearch);
    setUsers(res.data.users);
  };

  const fetchProperties = async () => {
    const res = await adminService.getAllProperties(propertyFilter, propertySearch);
    setProperties(res.data.properties);
  };

  const fetchBookings = async () => {
    const res = await adminService.getAllBookings();
    setBookings(res.data.bookings);
  };

  const loadTabData = async (t) => {
    setLoading(true);
    try {
      if (t === 'overview') await fetchOverview();
      if (t === 'users') await fetchUsers();
      if (t === 'properties') await fetchProperties();
      if (t === 'bookings') await fetchBookings();
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabData(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (tab === 'users') {
      const timer = setTimeout(() => fetchUsers(), 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSearch]);

  useEffect(() => {
    if (tab === 'properties') {
      const timer = setTimeout(() => fetchProperties(), 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyFilter, propertySearch]);

  const handleBlockToggle = async (user) => {
    try {
      await adminService.updateUser(user._id, { isBlocked: !user.isBlocked });
      toast.success(user.isBlocked ? 'User unblocked' : 'User blocked');
      fetchUsers();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await adminService.deleteUser(deleteUserTarget);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Deletion failed');
    } finally {
      setDeleteUserTarget(null);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveProperty(id);
      toast.success('Property approved');
      fetchProperties();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectProperty(id);
      toast.success('Property rejected');
      fetchProperties();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDeleteProperty = async () => {
    try {
      await adminService.deleteAnyProperty(deletePropertyTarget);
      toast.success('Property deleted');
      fetchProperties();
    } catch (err) {
      toast.error('Deletion failed');
    } finally {
      setDeletePropertyTarget(null);
    }
  };

  const handleExportUsers = () => {
    const exportData = users.map((u) => ({
      ID: u._id,
      FullName: u.fullname,
      Email: u.email,
      Phone: u.phone || '',
      Status: u.isBlocked ? 'Blocked' : 'Active',
      Joined: new Date(u.createdAt).toLocaleDateString()
    }));
    exportToCSV('users_report.csv', exportData);
  };

  const handleExportProperties = () => {
    const exportData = properties.map((p) => ({
      ID: p._id,
      Title: p.title,
      Owner: p.owner?.fullname || '',
      City: p.city,
      Price: p.price,
      Status: p.status,
      Type: p.propertyType,
      Created: new Date(p.createdAt).toLocaleDateString()
    }));
    exportToCSV('properties_report.csv', exportData);
  };

  const handleExportBookings = () => {
    const exportData = bookings.map((b) => ({
      ID: b._id,
      Property: b.property?.title || '',
      Tenant: b.user?.fullname || '',
      Owner: b.owner?.fullname || '',
      MoveInDate: new Date(b.moveInDate).toLocaleDateString(),
      PaymentStatus: b.paymentStatus,
      BookingStatus: b.bookingStatus,
      BookedOn: new Date(b.createdAt).toLocaleDateString()
    }));
    exportToCSV('bookings_report.csv', exportData);
  };

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = async () => {
    await logout();
    toast.info('Admin session logged out');
    navigate('/admin/login');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">👑 Admin Portal</h3>
          <p className="text-muted small mb-0">Platform overview, listings control, and user management ({user?.email})</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {tab === 'users' && (
            <button className="btn btn-outline-success btn-sm" onClick={handleExportUsers}>
              📥 Export Users CSV
            </button>
          )}
          {tab === 'properties' && (
            <button className="btn btn-outline-success btn-sm" onClick={handleExportProperties}>
              📥 Export Properties CSV
            </button>
          )}
          {tab === 'bookings' && (
            <button className="btn btn-outline-success btn-sm" onClick={handleExportBookings}>
              📥 Export Bookings CSV
            </button>
          )}
          <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={handleAdminLogout}>
            🚪 Logout Admin
          </button>
        </div>
      </div>

      <ul className="nav nav-pills mb-4 gap-2 bg-light p-2 rounded-3 border">
        {['overview', 'users', 'properties', 'bookings'].map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link fw-semibold px-4 py-2 ${tab === t ? 'active bg-dark text-white' : 'text-dark'}`}
              onClick={() => setTab(t)}
            >
              {t === 'overview' && '📊 Overview'}
              {t === 'users' && '👥 Users'}
              {t === 'properties' && '🏠 Properties'}
              {t === 'bookings' && '📅 Bookings'}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {tab === 'overview' && stats && (
            <>
              <div className="row g-3 mb-4">
                {[
                  ['Total Users', stats.totalUsers, 'bg-primary text-white'],
                  ['Total Properties', stats.totalProperties, 'bg-info text-dark'],
                  ['Pending Review', stats.pendingProperties, 'bg-warning text-dark'],
                  ['Approved Properties', stats.approvedProperties, 'bg-success text-white'],
                  ['Rejected Listings', stats.rejectedProperties, 'bg-secondary text-white'],
                  ['Total Bookings', stats.totalBookings, 'bg-dark text-white'],
                  ['Total Revenue', `₹${(stats.totalRevenue || 0).toLocaleString()}`, 'bg-danger text-white']
                ].map(([label, value, bgClass]) => (
                  <div className="col-lg-3 col-md-4 col-6" key={label}>
                    <div className={`card ${bgClass} border-0 shadow-sm p-3 rounded-3 text-center`}>
                      <h6 className="opacity-75 small mb-1">{label}</h6>
                      <h3 className="fw-bold mb-0">{value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="card p-4 shadow-sm border-0 rounded-4">
                    <h5 className="mb-3 fw-bold">Properties Added ({new Date().getFullYear()})</h5>
                    <Bar
                      data={{
                        labels: MONTHS,
                        datasets: [
                          { label: 'Properties', data: monthlyProperties, backgroundColor: '#2563eb', borderRadius: 6 }
                        ]
                      }}
                      options={{ responsive: true, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card p-4 shadow-sm border-0 rounded-4">
                    <h5 className="mb-3 fw-bold">Bookings Created ({new Date().getFullYear()})</h5>
                    <Bar
                      data={{
                        labels: MONTHS,
                        datasets: [
                          { label: 'Bookings', data: monthlyBookings, backgroundColor: '#10b981', borderRadius: 6 }
                        ]
                      }}
                      options={{ responsive: true, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'users' && (
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="fw-bold mb-0">Registered Platform Users</h5>
                <input
                  type="text"
                  className="form-control w-auto"
                  placeholder="🔍 Search name, email, phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="fw-semibold">{u.fullname}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || '-'}</td>
                        <td>
                          <span className={`badge ${u.isBlocked ? 'bg-danger' : 'bg-success'}`}>
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleBlockToggle(u)}>
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteUserTarget(u._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan="5" className="text-center text-muted py-4">No matching users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'properties' && (
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="fw-bold mb-0">Listings</h5>
                  <select
                    className="form-select w-auto form-select-sm"
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="">All Statuses</option>
                  </select>
                </div>
                <input
                  type="text"
                  className="form-control w-auto"
                  placeholder="🔍 Search title, city, type..."
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                />
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr><th>Title</th><th>Owner</th><th>City</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr key={p._id}>
                        <td className="fw-semibold">{p.title}</td>
                        <td>{p.owner?.fullname || 'Unknown'}</td>
                        <td>{p.city}</td>
                        <td>₹{p.price?.toLocaleString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              p.status === 'Approved'
                                ? 'bg-success'
                                : p.status === 'Pending'
                                ? 'bg-warning text-dark'
                                : 'bg-danger'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td>
                          {p.status !== 'Approved' && (
                            <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleApprove(p._id)}>
                              Approve
                            </button>
                          )}
                          {p.status !== 'Rejected' && (
                            <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleReject(p._id)}>
                              Reject
                            </button>
                          )}
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setDeletePropertyTarget(p._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && (
                      <tr><td colSpan="6" className="text-center text-muted py-4">No matching properties found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'bookings' && (
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <h5 className="fw-bold mb-3">All System Bookings</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr><th>Property</th><th>Tenant</th><th>Owner</th><th>Move-in</th><th>Payment</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td className="fw-semibold">{b.property?.title || 'Deleted Property'}</td>
                        <td>{b.user?.fullname || 'Unknown'}</td>
                        <td>{b.owner?.fullname || 'Unknown'}</td>
                        <td>{new Date(b.moveInDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${b.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{b.bookingStatus}</span>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr><td colSpan="6" className="text-center text-muted py-4">No bookings found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        show={!!deleteUserTarget}
        title="Delete User"
        message="Are you sure you want to permanently delete this user?"
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteUserTarget(null)}
        confirmText="Delete"
      />
      <ConfirmModal
        show={!!deletePropertyTarget}
        title="Delete Property"
        message="Are you sure you want to permanently delete this property?"
        onConfirm={handleDeleteProperty}
        onCancel={() => setDeletePropertyTarget(null)}
        confirmText="Delete"
      />
    </div>
  );
};

export default AdminDashboard;
