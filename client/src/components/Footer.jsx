import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer mt-auto">
    <div className="container">
      <div className="row">
        <div className="col-md-4 mb-3">
          <h5 className="text-white">🏠 HouseRent</h5>
          <p className="small">Find your perfect rental home, hassle-free.</p>
        </div>
        <div className="col-md-4 mb-3">
          <h6 className="text-white">Quick Links</h6>
          <ul className="list-unstyled small">
            <li><Link className="text-decoration-none text-secondary" to="/properties">Properties</Link></li>
            <li><Link className="text-decoration-none text-secondary" to="/about">About Us</Link></li>
            <li><Link className="text-decoration-none text-secondary" to="/contact">Contact</Link></li>
            <li><Link className="text-decoration-none text-info font-monospace fw-bold" to="/admin/login">🔐 Admin Portal</Link></li>
          </ul>
        </div>
        <div className="col-md-4 mb-3">
          <h6 className="text-white">Contact</h6>
          <p className="small mb-0">support@houserent.com</p>
          <p className="small">+91 98765 43210</p>
        </div>
      </div>
      <hr className="border-secondary" />
      <p className="text-center small mb-0">&copy; {new Date().getFullYear()} HouseRent. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
