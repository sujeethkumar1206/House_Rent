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
  const [filters, setFilters] = useState({ city: searchParams.get('city') || '' });

  const fetchProperties = useCallback(async (currentFilters, currentPage) => {
    setLoading(true);
    try {
      const res = await getProperties({ ...currentFilters, page: currentPage, limit: 9 });
      setProperties(res.data.properties);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(filters, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchProperties(filters, 1);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Browse Properties</h3>
      <SearchFilters filters={filters} onChange={setFilters} onSearch={handleSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="row g-4">
            {properties.map((p) => (
              <div className="col-md-4" key={p._id}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
          {properties.length === 0 && (
            <p className="text-muted text-center py-5">No properties match your search criteria.</p>
          )}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Properties;
