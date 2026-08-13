import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProperty } from '../services/propertyService.js';
import { createBooking } from '../services/bookingService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import useAuth from '../hooks/useAuth.js';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageHelper.js';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [moveInDate, setMoveInDate] = useState('');
  const [booking, setBooking] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await getProperty(id);
        setProperty(res.data.property);
      } catch (err) {
        toast.error('Property not found');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to book a property');
      navigate('/login');
      return;
    }
    if (!moveInDate) {
      toast.error('Please select a move-in date');
      return;
    }
    setBooking(true);
    try {
      await createBooking({ property: id, moveInDate });
      toast.success('Booking request sent successfully!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!property) return null;

  const rawImages = property.images && property.images.length > 0 ? property.images : [null];
  const images = rawImages.map((img) => getImageUrl(img));

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-7">
          <img
            src={images[activeImage]}
            alt={property.title}
            className="img-fluid rounded mb-2"
            style={{ width: '100%', height: 400, objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
          />
          {images.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  onClick={() => setActiveImage(idx)}
                  className={`rounded ${idx === activeImage ? 'border border-primary border-3' : ''}`}
                  style={{ width: 80, height: 60, objectFit: 'cover', cursor: 'pointer' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
              ))}
            </div>
          )}

          <h2 className="mt-4">{property.title}</h2>
          <p className="text-muted">{property.location}, {property.city}, {property.state}</p>
          <span className={`badge status-badge-${property.status} mb-3`}>{property.status}</span>
          <h4 className="text-primary">₹{property.price?.toLocaleString()}/month</h4>

          <div className="row g-3 my-3">
            <div className="col-3"><strong>{property.bedrooms}</strong><br /><small className="text-muted">Bedrooms</small></div>
            <div className="col-3"><strong>{property.bathrooms}</strong><br /><small className="text-muted">Bathrooms</small></div>
            <div className="col-3"><strong>{property.area}</strong><br /><small className="text-muted">Sqft</small></div>
            <div className="col-3"><strong>{property.furnishing}</strong><br /><small className="text-muted">Furnishing</small></div>
          </div>

          <h5>Description</h5>
          <p>{property.description}</p>

          {property.amenities?.length > 0 && (
            <>
              <h5>Amenities</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {property.amenities.map((a, idx) => (
                  <span key={idx} className="badge bg-light text-dark border">{a}</span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4">
            <h5>Owner Details</h5>
            <p className="mb-1">{property.owner?.fullname}</p>
            <p className="mb-1 text-muted small">{property.owner?.email}</p>
            <p className="mb-3 text-muted small">{property.owner?.phone}</p>

            <hr />

            <h5>Book This Property</h5>
            <form onSubmit={handleBooking}>
              <div className="mb-3">
                <label className="form-label">Move-in Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <button className="btn btn-brand w-100" type="submit" disabled={booking}>
                {booking ? 'Sending request...' : 'Request Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
