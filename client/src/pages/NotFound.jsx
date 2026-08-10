import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container text-center py-5">
    <h1 className="display-1 fw-bold text-primary">404</h1>
    <p className="lead">Oops! The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-brand">Back to Home</Link>
  </div>
);

export default NotFound;
