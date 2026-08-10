const LoadingSpinner = ({ small }) => (
  <div className={`d-flex justify-content-center align-items-center ${small ? 'py-2' : 'py-5'}`}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;
