import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProperty, updateProperty, getProperty } from '../services/propertyService.js';

const AMENITY_OPTIONS = ['WiFi', 'Power Backup', 'Water Supply', 'Security', 'Lift', 'Gym', 'Swimming Pool', 'Garden'];

const emptyForm = {
  title: '', description: '', price: '', location: '', city: '', state: '',
  propertyType: 'Apartment', bedrooms: 1, bathrooms: 1, parking: false,
  furnishing: 'Unfurnished', area: ''
};

const AddEditProperty = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      const fetchProperty = async () => {
        try {
          const res = await getProperty(id);
          const p = res.data.property;
          setForm({
            title: p.title, description: p.description, price: p.price, location: p.location,
            city: p.city, state: p.state, propertyType: p.propertyType, bedrooms: p.bedrooms,
            bathrooms: p.bathrooms, parking: p.parking, furnishing: p.furnishing, area: p.area
          });
          setAmenities(p.amenities || []);
        } catch (err) {
          toast.error('Failed to load property');
        }
      };
      fetchProperty();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('amenities', JSON.stringify(amenities));
      images.forEach((img) => formData.append('images', img));

      if (isEdit) {
        await updateProperty(id, formData);
        toast.success('Property updated! It will be reviewed again before publishing.');
      } else {
        await createProperty(formData);
        toast.success('Property submitted for admin approval!');
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.errors
        ? err.response.data.errors.map((x) => x.msg).join(', ')
        : err.response?.data?.message || 'Failed to save property';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <h3 className="mb-4">{isEdit ? 'Edit Property' : 'Add New Property'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="4" name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label">Price (₹/month)</label>
            <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Property Type</label>
            <select className="form-select" name="propertyType" value={form.propertyType} onChange={handleChange}>
              <option>Apartment</option><option>Villa</option><option>Independent House</option>
              <option>PG</option><option>Studio</option><option>Commercial</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Furnishing</label>
            <select className="form-select" name="furnishing" value={form.furnishing} onChange={handleChange}>
              <option>Furnished</option><option>Semi-Furnished</option><option>Unfurnished</option>
            </select>
          </div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-3">
            <label className="form-label">Location / Area</label>
            <input className="form-control" name="location" value={form.location} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">City</label>
            <input className="form-control" name="city" value={form.city} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">State</label>
            <input className="form-control" name="state" value={form.state} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Area (sqft)</label>
            <input type="number" className="form-control" name="area" value={form.area} onChange={handleChange} />
          </div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-3">
            <label className="form-label">Bedrooms</label>
            <input type="number" className="form-control" name="bedrooms" value={form.bedrooms} onChange={handleChange} min="0" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Bathrooms</label>
            <input type="number" className="form-control" name="bathrooms" value={form.bathrooms} onChange={handleChange} min="0" />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="parking" checked={form.parking} onChange={handleChange} id="parkingCheck" />
              <label className="form-check-label" htmlFor="parkingCheck">Parking Available</label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label d-block">Amenities</label>
          {AMENITY_OPTIONS.map((a) => (
            <div className="form-check form-check-inline" key={a}>
              <input className="form-check-input" type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} id={`amenity-${a}`} />
              <label className="form-check-label" htmlFor={`amenity-${a}`}>{a}</label>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="form-label">Property Images (up to 10)</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
        </div>

        <button className="btn btn-brand" type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Submit Property'}
        </button>
      </form>
    </div>
  );
};

export default AddEditProperty;
