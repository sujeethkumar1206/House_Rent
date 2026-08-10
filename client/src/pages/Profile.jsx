import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth.js';
import { updateProfile, changePassword } from '../services/authService.js';

const Profile = () => {
  const { user, updateUserState, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: user?.fullname || '', phone: user?.phone || '', address: user?.address || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const handleProfileChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append('profileImage', imageFile);

      const res = await updateProfile(formData);
      updateUserState(res.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await changePassword(pwForm);
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">My Profile</h3>
        <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="card p-4 shadow-sm border-0 mb-4">
        <h5 className="mb-3">Profile Information</h5>
        <form onSubmit={handleProfileSubmit}>
          {user?.profileImage && (
            <img src={user.profileImage} alt="profile" className="rounded-circle mb-3" style={{ width: 80, height: 80, objectFit: 'cover' }} />
          )}
          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input className="form-control" name="fullname" value={form.fullname} onChange={handleProfileChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={user?.email || ''} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input className="form-control" name="phone" value={form.phone} onChange={handleProfileChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input className="form-control" name="address" value={form.address} onChange={handleProfileChange} />
          </div>
          <button className="btn btn-brand" type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card p-4 shadow-sm border-0">
        <h5 className="mb-3">Change Password</h5>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-control" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} minLength={6} required />
          </div>
          <button className="btn btn-outline-primary" type="submit" disabled={savingPassword}>
            {savingPassword ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
