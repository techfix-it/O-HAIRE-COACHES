'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Ticket, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Clock,
  LayoutDashboard,
  Edit2,
  Trash2,
  Save,
  X,
  Phone,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../../lib/api';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { GlobalBackground } from '../../../components/GlobalBackground';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
    }
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          line1: user.address?.line1 || '',
          line2: user.address?.line2 || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          postal_code: user.address?.postal_code || '',
        }
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/auth/me', formData);
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/auth/me');
        window.location.href = '/login';
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account.');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative">
      <GlobalBackground />
      <Header />
      
      <main className="dashboard-page">
        <div className="dashboard-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="dashboard-header"
          >
            <div className="dashboard-welcome">
              <p className="dashboard-subtitle">Welcome back,</p>
              <h1 className="dashboard-title">{user.name.split(' ')[0]}</h1>
            </div>
            
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </motion.div>

          <div className="dashboard-grid">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="dashboard-main"
            >
              <div className="dashboard-card">
                <h2 className="card-title">
                  <Ticket />
                  Your Bookings
                </h2>
                
                <div className="bookings-empty">
                  <LayoutDashboard className="empty-icon" />
                  <p>You haven't booked any concert coaches yet.</p>
                  <Link href="/concerts" className="browse-btn">
                    Browse Upcoming Concerts
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="dashboard-sidebar"
            >
              <div className="dashboard-card">
                <div className="card-header-actions">
                  <h2 className="card-title">
                    <UserIcon />
                    Profile Details
                  </h2>
                  <div className="crud-actions">
                    {!isEditing ? (
                      <>
                        <button onClick={() => setIsEditing(true)} className="action-btn edit" title="Edit Profile">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={handleDeleteAccount} className="action-btn delete" title="Delete Account">
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setIsEditing(false)} className="action-btn cancel" title="Cancel">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
                
                {!isEditing ? (
                  <div className="profile-info">
                    <div className="info-item">
                      <span className="info-label">Full Name</span>
                      <span className="info-value">{user.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email Address</span>
                      <span className="info-value">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="info-item">
                        <span className="info-label">Phone</span>
                        <span className="info-value">{user.phone}</span>
                      </div>
                    )}
                    {user.address?.line1 && (
                      <div className="info-item">
                        <span className="info-label">Address</span>
                        <span className="info-value">
                          {user.address.line1}<br />
                          {user.address.line2 && <>{user.address.line2}<br /></>}
                          {user.address.city}, {user.address.state} {user.address.postal_code}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                    <div className="form-grid">
                      <div className="form-group col-span-2">
                        <label className="info-label">Full Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="dashboard-input"
                          required
                        />
                      </div>
                      <div className="form-group col-span-2">
                        <label className="info-label">Phone Number</label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="dashboard-input"
                          placeholder="+353 8X XXX XXXX"
                        />
                      </div>
                      <div className="form-group col-span-2">
                        <label className="info-label">Address Line 1</label>
                        <input 
                          type="text" 
                          value={formData.address.line1}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: { ...formData.address, line1: e.target.value }
                          })}
                          className="dashboard-input"
                        />
                      </div>
                      <div className="form-group col-span-2">
                        <label className="info-label">Address Line 2 (Optional)</label>
                        <input 
                          type="text" 
                          value={formData.address.line2}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: { ...formData.address, line2: e.target.value }
                          })}
                          className="dashboard-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="info-label">City</label>
                        <input 
                          type="text" 
                          value={formData.address.city}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: { ...formData.address, city: e.target.value }
                          })}
                          className="dashboard-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="info-label">County/State</label>
                        <input 
                          type="text" 
                          value={formData.address.state}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: { ...formData.address, state: e.target.value }
                          })}
                          className="dashboard-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="info-label">Eircode / Postal Code</label>
                        <input 
                          type="text" 
                          value={formData.address.postal_code}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: { ...formData.address, postal_code: e.target.value }
                          })}
                          className="dashboard-input"
                        />
                      </div>
                    </div>
                    <button type="submit" className="save-profile-btn" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                      <Save size={18} />
                    </button>
                  </form>
                )}
                
                {user.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className="admin-control-link"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="text-zinc-400" size={20} />
                      <span>Admin Control Panel</span>
                    </div>
                    <ChevronRight size={20} className="text-zinc-300" />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
