import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getBookings, updateBooking, deleteBooking } from '../services/bookingService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

const statusBadge = (status) => {
  const map = {
    Requested: 'bg-warning text-dark',
    Confirmed: 'bg-success',
    Cancelled: 'bg-danger',
    Completed: 'bg-secondary'
  };
  return map[status] || 'bg-light text-dark';
};

const Bookings = () => {
  const [asTenant, setAsTenant] = useState([]);
  const [asOwner, setAsOwner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [tab, setTab] = useState('tenant');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      setAsTenant(res.data.asTenant);
      setAsOwner(res.data.asOwner);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, bookingStatus) => {
    try {
      await updateBooking(id, { bookingStatus });
      toast.success(`Booking marked as ${bookingStatus}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = async () => {
    try {
      await deleteBooking(cancelTarget);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelTarget(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  const list = tab === 'tenant' ? asTenant : asOwner;

  return (
    <div className="container py-4">
      <h3 className="mb-4">My Bookings</h3>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'tenant' ? 'active' : ''}`} onClick={() => setTab('tenant')}>
            As Tenant ({asTenant.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'owner' ? 'active' : ''}`} onClick={() => setTab('owner')}>
            As Owner ({asOwner.length})
          </button>
        </li>
      </ul>

      <div className="table-responsive">
        <table className="table align-middle bg-white shadow-sm rounded">
          <thead>
            <tr>
              <th>Property</th>
              <th>{tab === 'tenant' ? 'Owner' : 'Tenant'}</th>
              <th>Move-in Date</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b._id}>
                <td>{b.property?.title || 'N/A'}</td>
                <td>{tab === 'tenant' ? b.owner?.fullname : b.user?.fullname}</td>
                <td>{new Date(b.moveInDate).toLocaleDateString()}</td>
                <td>{b.paymentStatus}</td>
                <td><span className={`badge ${statusBadge(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
                <td>
                  {tab === 'owner' && b.bookingStatus === 'Requested' && (
                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleStatusChange(b._id, 'Confirmed')}>
                      Confirm
                    </button>
                  )}
                  {b.bookingStatus !== 'Cancelled' && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setCancelTarget(b._id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan="6" className="text-center text-muted py-4">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={!!cancelTarget}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
        confirmText="Yes, Cancel"
      />
    </div>
  );
};

export default Bookings;
