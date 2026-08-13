import { Link } from 'react-router-dom';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageHelper.js';

const PropertyCard = ({ property }) => {
  const rawImage = property.images && property.images.length > 0 ? property.images[0] : null;
  const image = getImageUrl(rawImage);

  return (
    <div className="card property-card h-100 shadow-sm border-0">
      <img
        src={image}
        alt={property.title}
        className="card-img-top"
        style={{ height: '220px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK_IMAGE;
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1">{property.title}</h5>
        <p className="text-muted small mb-2">{property.location}, {property.city}</p>
        <div className="d-flex gap-3 small text-muted mb-2">
          <span>🛏 {property.bedrooms}</span>
          <span>🛁 {property.bathrooms}</span>
          <span>📐 {property.area} sqft</span>
        </div>
        <h5 className="text-primary mb-3">₹{property.price?.toLocaleString()}/mo</h5>
        <Link to={`/properties/${property._id}`} className="btn btn-brand mt-auto">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
