import { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would POST to a /api/contact endpoint
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Contact Us</h2>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="4" name="message" value={form.message} onChange={handleChange} required />
            </div>
            <button className="btn btn-brand" type="submit">Send Message</button>
          </form>
        </div>
        <div className="col-md-6">
          <h5>Get in Touch</h5>
          <p className="text-muted">📍 123 Anna Salai, Chennai, Tamil Nadu</p>
          <p className="text-muted">📞 +91 98765 43210</p>
          <p className="text-muted">✉️ support@houserent.com</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
