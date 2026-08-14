import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../services/propertyService.js';
import PropertyCard from '../components/PropertyCard.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import Pagination from '../components/Pagination.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getInitialFiltersFromUrl = useCallback(() => ({
    city: searchParams.get('city') || '',
    q: searchParams.get('q') || '',
    propertyType: searchParams.get('propertyType') || '',
    furnishing: searchParams.get('furnishing') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || ''
  }), [searchParams]);

  const [filters, setFilters] = useState(getInitialFiltersFromUrl);

  const fetchProperties = useCallback(async (currentFilters, currentPage) => {
    setLoading(true);
    try {
      const res = await getProperties({ ...currentFilters, page: currentPage, limit: 9 });
      setProperties(res.data.properties);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const urlFilters = getInitialFiltersFromUrl();
    setFilters(urlFilters);
    setPage(1);
    fetchProperties(urlFilters, 1);
  }, [searchParams, getInitialFiltersFromUrl, fetchProperties]);

  const handleSearch = (newFilters) => {
    const updated = newFilters || filters;
    setFilters(updated);
    setPage(1);
    fetchProperties(updated, 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchProperties(filters, newPage);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Browse Properties</h3>
      <SearchFilters filters={filters} onChange={setFilters} onSearch={handleSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {properties.length > 0 ? (
            <div className="row g-4">
              {properties.map((p) => (
                <div className="col-md-4" key={p._id}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted mb-3 fs-5">No properties match your search criteria.</p>
              <button
                className="btn btn-brand"
                onClick={() => {
                  const empty = { city: '', q: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '', furnishing: '', parking: '', sort: '' };
                  handleSearch(empty);
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
};

export default Properties;
