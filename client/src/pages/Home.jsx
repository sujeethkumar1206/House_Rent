import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProperties } from '../services/propertyService.js';
import PropertyCard from '../components/PropertyCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getProperties({ limit: 6, sort: '' });
        setProperties(res.data.properties);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties${city ? `?city=${encodeURIComponent(city)}` : ''}`);
  };

  return (
    <div>
      <section className="hero-section text-center">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Find Your Perfect Rental Home</h1>
          <p className="lead mb-4">Browse thousands of verified listings across Tamil Nadu and beyond.</p>
          <form className="d-flex justify-content-center gap-2" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search by city (e.g. Chennai, Coimbatore)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button className="btn btn-light fw-semibold" type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Featured Properties</h3>
          <Link to="/properties" className="btn btn-outline-primary btn-sm">View All</Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="row g-4">
            {properties.map((p) => (
              <div className="col-md-4" key={p._id}>
                <PropertyCard property={p} />
              </div>
            ))}
            {properties.length === 0 && <p className="text-muted">No properties available yet.</p>}
          </div>
        )}
      </section>

      <section className="bg-light py-5">
        <div className="container text-center">
          <h4 className="mb-4">Why Choose HouseRent?</h4>
          <div className="row g-4">
            <div className="col-md-4">
              <h5>✅ Verified Listings</h5>
              <p className="text-muted small">Every property is reviewed by our admin team before going live.</p>
            </div>
            <div className="col-md-4">
              <h5>🔍 Powerful Search</h5>
              <p className="text-muted small">Filter by price, location, bedrooms, and more to find your fit.</p>
            </div>
            <div className="col-md-4">
              <h5>🔒 Secure Booking</h5>
              <p className="text-muted small">Book with confidence with our secure, tracked booking system.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
