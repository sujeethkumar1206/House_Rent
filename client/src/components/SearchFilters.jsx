import { useState, useEffect } from 'react';

const SearchFilters = ({ filters, onChange, onSearch }) => {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    onChange(local);
    onSearch(local);
  };

  const handleClear = () => {
    const emptyFilters = {
      q: '',
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      furnishing: '',
      parking: '',
      sort: ''
    };
    setLocal(emptyFilters);
    onChange(emptyFilters);
    onSearch(emptyFilters);
  };

  return (
    <form className="card p-3 shadow-sm border-0 mb-4" onSubmit={handleApply}>
      <div className="row g-2 align-items-end">
        <div className="col-md-3">
          <label className="form-label small mb-1">Search</label>
          <input
            type="text"
            className="form-control"
            name="q"
            placeholder="Title, city, location..."
            value={local.q || ''}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small mb-1">City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            placeholder="Chennai"
            value={local.city || ''}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small mb-1">Property Type</label>
          <select className="form-select" name="propertyType" value={local.propertyType || ''} onChange={handleChange}>
            <option value="">Any</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Independent House</option>
            <option>PG</option>
            <option>Studio</option>
            <option>Commercial</option>
          </select>
        </div>
        <div className="col-md-1">
          <label className="form-label small mb-1">Min ₹</label>
          <input type="number" className="form-control" name="minPrice" value={local.minPrice || ''} onChange={handleChange} />
        </div>
        <div className="col-md-1">
          <label className="form-label small mb-1">Max ₹</label>
          <input type="number" className="form-control" name="maxPrice" value={local.maxPrice || ''} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <label className="form-label small mb-1">Bedrooms</label>
          <select className="form-select" name="bedrooms" value={local.bedrooms || ''} onChange={handleChange}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-brand w-100">Go</button>
        </div>
      </div>
      <div className="row g-2 mt-2 align-items-end">
        <div className="col-md-3">
          <label className="form-label small mb-1">Furnishing</label>
          <select className="form-select" name="furnishing" value={local.furnishing || ''} onChange={handleChange}>
            <option value="">Any</option>
            <option>Furnished</option>
            <option>Semi-Furnished</option>
            <option>Unfurnished</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label small mb-1">Parking</label>
          <select className="form-select" name="parking" value={local.parking || ''} onChange={handleChange}>
            <option value="">Any</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label small mb-1">Sort By</label>
          <select className="form-select" name="sort" value={local.sort || ''} onChange={handleChange}>
            <option value="">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="price_low">Lowest Price</option>
            <option value="price_high">Highest Price</option>
          </select>
        </div>
        <div className="col-md-4 text-end">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleClear}>
            Clear Filters
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchFilters;
