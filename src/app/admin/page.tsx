'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Bus, 
  Settings, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard, 
  Ticket,
  ChevronRight,
  ChevronDown,
  Info,
  Clock,
  Euro,
  Image as ImageIcon,
  Upload,
  Search,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Globe,
  Layout,
  LogOut,
  Type,
  Link as LinkIcon,
  CreditCard
} from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import api from '../../lib/api';
import './Admin.css';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// ----------------------------------------------------
// Types
// ----------------------------------------------------
interface Venue {
  _id: string;
  name: string;
  address: string;
  city: string;
  image?: string;
}

interface PickupLocation {
  _id: string;
  name: string;
  description: string;
  price?: number;
  time?: string;
  venue?: Venue;
}

interface BusRoute {
  _id: string;
  event: string;
  pickupLocation: PickupLocation;
  departureTime: string;
  price: number;
  capacity: number;
  booked: number;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: Venue;
  description: string;
  imageUrl: string;
  price: number;
  routes?: BusRoute[];
}

// ----------------------------------------------------
// Layout
// ----------------------------------------------------
const AdminLayout = ({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    api.post('/auth/logout').then(() => {
      router.push('/login');
    });
  };

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Mobile top bar */}
      <header className="admin-mobile-topbar">
        <button
          className="admin-hamburger"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>
        <span className="admin-mobile-title">O&apos;HAIRE <em>ADMIN</em></span>
      </header>

      {/* Overlay */}
      {isDrawerOpen && (
        <div className="admin-drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
      )}

      <aside className={`admin-sidebar ${isDrawerOpen ? 'drawer-open' : ''}`}>
        <button className="admin-drawer-close" onClick={() => setIsDrawerOpen(false)} aria-label="Close menu">✕</button>
        <Link href="/" className="admin-logo">
          O&apos;HAIRE <span className="italic">ADMIN</span>
        </Link>
        <nav className="admin-nav">
          <div className="admin-nav-section">SHOP MANAGEMENT</div>
          <button onClick={() => handleNav('dashboard')} className={`admin-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}><LayoutDashboard className="icon-w-5" /> Dashboard</button>
          <button onClick={() => handleNav('events')} className={`admin-nav-link ${activeTab === 'events' ? 'active' : ''}`}><Ticket className="icon-w-5" /> Events</button>
          <button onClick={() => handleNav('venues')} className={`admin-nav-link ${activeTab === 'venues' ? 'active' : ''}`}><MapPin className="icon-w-5" /> Venues</button>
          <button onClick={() => handleNav('pickup')} className={`admin-nav-link ${activeTab === 'pickup' ? 'active' : ''}`}><Bus className="icon-w-5" /> Pickup Points</button>
          
          <div className="admin-nav-section mt-6">SITE MANAGEMENT</div>
          <button onClick={() => handleNav('site')} className={`admin-nav-link ${activeTab === 'site' ? 'active' : ''}`}><Globe className="icon-w-5" /> Pages</button>
          <button onClick={() => handleNav('components')} className={`admin-nav-link ${activeTab === 'components' ? 'active' : ''}`}><Layout className="icon-w-5" /> Components</button>
          <button onClick={() => handleNav('payments')} className={`admin-nav-link ${activeTab === 'payments' ? 'active' : ''}`}><CreditCard className="icon-w-5" /> Payments</button>

          <div className="mt-8 pt-8 border-t border-zinc-200">
            <button onClick={handleLogout} className="admin-nav-link text-red-500 hover:bg-red-50 hover:text-red-600 w-full text-left">
              <LogOut className="icon-w-5" /> Exit Admin
            </button>
          </div>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};


// ----------------------------------------------------
// Sub-Components
// ----------------------------------------------------
const AdminDashboard = () => (
  <div>
    <h1 className="admin-page-title">DASHBOARD</h1>
    <div className="stats-grid">
      {[
        { label: 'Total Events', value: '12', icon: Ticket },
        { label: 'Active Routes', value: '48', icon: Bus },
        { label: 'Bookings (24h)', value: '156', icon: Euro },
      ].map((stat, i) => (
        <div key={i} className="stat-card">
          <div className="stat-header">
            <span className="stat-label">{stat.label}</span>
            <stat.icon className="stat-icon" />
          </div>
          <div className="stat-value">{stat.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showRouteForm, setShowRouteForm] = useState<string | null>(null);
  const defaultForm = { title: '', date: '', venue: '', description: '', imageUrl: '', price: '0' };
  const [formData, setFormData] = useState(defaultForm);
  const [routeData, setRouteData] = useState({ pickupLocation: '', departureTime: '', price: '25', capacity: '50' });
  const [searchTerm, setSearchTerm] = useState('');
  const [venueFilter, setVenueFilter] = useState('');

  const fetchData = () => {
    api.get('/events').then(res => setEvents(res.data));
    api.get('/venues').then(res => setVenues(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  const openEdit = (event: Event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      venue: typeof event.venue === 'object' ? event.venue._id : event.venue,
      description: event.description,
      imageUrl: event.imageUrl,
      price: String(event.price)
    });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(defaultForm);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = editingId
      ? api.put(`/events/${editingId}`, formData)
      : api.post('/events', formData);
    req.then(() => { handleClose(); fetchData(); });
  };

  const handleRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/bus-routes', { ...routeData, event: showRouteForm })
      .then(() => { setShowRouteForm(null); fetchData(); });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      api.delete(`/events/${id}`).then(fetchData);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="admin-page-title">MANAGE EVENTS</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search events..."
              className="admin-form-input pl-10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-1 md:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <select 
              className="admin-form-select pl-10 h-10"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
            >
              <option value="">All Venues</option>
              {venues.map(v => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => { setEditingId(null); setFormData(defaultForm); setShowForm(!showForm); }}
            className="admin-button-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="icon-w-4" /> New Event
          </button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="admin-form-card">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label className="admin-form-label">Title</label>
              <input 
                required
                className="admin-form-input"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Date</label>
              <input 
                type="datetime-local"
                required
                className="admin-form-input"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Venue</label>
              <select 
                required
                className="admin-form-select"
                value={formData.venue}
                onChange={e => setFormData({...formData, venue: e.target.value})}
              >
                <option value="">Select Venue</option>
                {venues.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Regular price (€)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="admin-form-input"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Image</label>
              <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <input 
                    className="admin-form-input"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  />
                  <div className="relative">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="event-image-upload"
                    />
                    <label 
                      htmlFor="event-image-upload"
                      className="admin-button-secondary w-full flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" /> Upload Image
                    </label>
                  </div>
                </div>
                {formData.imageUrl && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 flex-shrink-0">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="admin-form-group md:col-span-2">
              <label className="admin-form-label">Description</label>
              <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                  <ReactQuill 
                  theme="snow"
                  value={formData.description}
                  onChange={content => { if (formData.description !== content) setFormData({...formData, description: content}) }}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link', 'clean']
                    ],
                  }}
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <div className="admin-form-actions md:col-span-2">
              <button type="button" onClick={handleClose} className="admin-button-secondary">Cancel</button>
              <button type="submit" className="admin-button-primary">{editingId ? 'Update Event' : 'Save Event'}</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="admin-table-header">
            <tr>
              <th className="admin-table-th">Event</th>
              <th className="admin-table-th">Venue</th>
              <th className="admin-table-th">Price</th>
              <th className="admin-table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events
              .filter(event => {
                const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     event.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesVenue = !venueFilter || 
                                    (typeof event.venue === 'object' && event.venue?._id === venueFilter) ||
                                    (typeof event.venue === 'string' && event.venue === venueFilter);
                return matchesSearch && matchesVenue;
              })
              .sort((a, b) => a.title.localeCompare(b.title))
              .map(event => (
              <tr key={event._id} className="admin-table-tr">
                <td className="admin-table-td">
                  <div className="font-bold text-zinc-900">{event.title}</div>
                  <div className="text-[10px] font-mono text-zinc-400">{format(new Date(event.date), 'MMM dd, yyyy HH:mm')}</div>
                </td>
                <td className="admin-table-td text-zinc-500">{event.venue?.name}</td>
                <td className="admin-table-td text-zinc-500">€{Number(event.price || 0).toFixed(2)}</td>
                <td className="admin-table-td text-right flex gap-2 justify-end">
                  <button
                    onClick={() => openEdit(event)}
                    className="admin-button-secondary"
                    title="Edit"
                  >
                    <Pencil className="icon-w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(event._id)}
                    className="admin-button-danger"
                  >
                    <Trash2 className="icon-w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const defaultForm = { name: '', address: '', city: '', image: '' };
  const [formData, setFormData] = useState(defaultForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchData = () => { api.get('/venues').then(res => setVenues(res.data)); };
  useEffect(() => { fetchData(); }, []);

  const openEdit = (v: Venue) => {
    setEditingId(v._id);
    setFormData({ name: v.name, address: v.address || '', city: v.city || '', image: v.image || '' });
    setImagePreview(v.image || null);
    setShowForm(true);
  };

  const handleClose = () => { 
    setShowForm(false); 
    setEditingId(null); 
    setFormData(defaultForm); 
    setImagePreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, image: base64 });
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Admin] Submitting venue formData:", {...formData, image: formData.image?.substring(0, 30) + "..."});
    
    const req = editingId
      ? api.put(`/venues/${editingId}`, formData)
      : api.post('/venues', formData);
    
    req.then((res) => { 
      console.log("[Admin] Venue submit success:", res.data);
      handleClose(); 
      fetchData(); 
    }).catch(err => {
      console.error("[Admin] Venue submit error:", err);
      alert("Erro ao salvar venue: " + (err.response?.data?.error || err.message));
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      api.delete(`/venues/${id}`).then(fetchData);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="admin-page-title">MANAGE VENUES</h1>
        <button onClick={() => { setEditingId(null); setFormData(defaultForm); setShowForm(!showForm); }} className="admin-button-primary flex items-center gap-2">
          <Plus className="icon-w-4" /> New Venue
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label className="admin-form-label">Name</label>
              <input required className="admin-form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">City</label>
              <input required className="admin-form-input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Address</label>
              <input required className="admin-form-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="admin-form-group md:col-span-3">
              <label className="admin-form-label uppercase tracking-widest text-[10px] font-bold text-zinc-400 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> FEATURE IMAGE
              </label>
              <div className="admin-image-upload-zone">
                <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden border border-zinc-200 bg-white flex-shrink-0 shadow-sm relative group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <ImageIcon className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="venue-image-upload"
                      />
                      <label 
                        htmlFor="venue-image-upload"
                        className="admin-button-secondary flex items-center gap-2 cursor-pointer h-10 px-4 text-xs"
                      >
                        <Upload className="w-3.5 h-3.5" /> Escolher ficheiro
                      </label>
                    </div>
                    <span className="text-[10px] text-zinc-400 italic">
                      {imagePreview ? 'Imagem selecionada' : 'Nenhum ficheiro selecionado'}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <input 
                      className="admin-form-input h-10 font-mono text-[11px] bg-white"
                      placeholder="Carregue um ficheiro ou cole o URL..."
                      value={formData.image}
                      onChange={e => {
                        setFormData({...formData, image: e.target.value});
                        setImagePreview(e.target.value);
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Carregue um ficheiro ou cole o URL. Formato horizontal recomendado (ex: 1920x1080px).
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-form-actions md:col-span-3">
              <button type="button" onClick={handleClose} className="admin-button-secondary">Cancel</button>
              <button type="submit" className="admin-button-primary">{editingId ? 'Update Venue' : 'Save Venue'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="admin-table-header">
            <tr>
              <th className="admin-table-th">Venue</th>
              <th className="admin-table-th">City</th>
              <th className="admin-table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
              {venues.map(v => (
              <tr key={v._id} className="admin-table-tr">
                <td className="admin-table-td">
                  <div className="flex items-center gap-4">
                    {v.image ? (
                        <img src={v.image} alt="" className="admin-venue-thumb" />
                      ) : (
                        <div className="admin-venue-thumb flex items-center justify-center text-zinc-300">
                          <ImageIcon className="w-5 h-5 opacity-40" />
                        </div>
                      )}
                    <span className="font-bold text-zinc-900">{v.name}</span>
                  </div>
                </td>
                <td className="admin-table-td text-zinc-500">{v.city}</td>
                <td className="admin-table-td text-right flex gap-2 justify-end">
                  <button onClick={() => openEdit(v)} className="admin-button-secondary" title="Edit"><Pencil className="icon-w-4" /></button>
                  <button onClick={() => handleDelete(v._id)} className="admin-button-danger"><Trash2 className="icon-w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminPickup = () => {
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const defaultForm = { name: '', description: '', price: '0', time: '', venue: '' };
  const [formData, setFormData] = useState(defaultForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [venueFilter, setVenueFilter] = useState('');

  const fetchData = () => { 
    api.get('/pickup-locations').then(res => setLocations(res.data)); 
    api.get('/venues').then(res => setVenues(res.data));
  };
  useEffect(() => { fetchData(); }, []);

  const openEdit = (l: PickupLocation) => {
    setEditingId(l._id);
    setFormData({ 
      name: l.name, 
      description: l.description || '',
      price: String(l.price || 0),
      time: l.time || '',
      venue: typeof l.venue === 'object' && l.venue !== null ? l.venue._id : ((l.venue as unknown as string) || '')
    });
    setShowForm(true);
  };

  const handleClose = () => { setShowForm(false); setEditingId(null); setFormData(defaultForm); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = editingId
      ? api.put(`/pickup-locations/${editingId}`, formData)
      : api.post('/pickup-locations', formData);
    req.then(() => { handleClose(); fetchData(); });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      api.delete(`/pickup-locations/${id}`).then(fetchData);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="admin-page-title">PICKUP POINTS</h1>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px] md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Filter by Location Name..."
              className="admin-form-input pl-10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-1 min-w-[200px] md:w-56">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <select 
              className="admin-form-select pl-10 h-10"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
            >
              <option value="">All Venues</option>
              {venues.map(v => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => { setEditingId(null); setFormData(defaultForm); setShowForm(!showForm); }} 
            className="admin-button-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="icon-w-4" /> New Point
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label className="admin-form-label">Location Name</label>
              <input required className="admin-form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Price (€)</label>
              <input type="number" step="0.01" required className="admin-form-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Time (Optional)</label>
              <input type="time" className="admin-form-input" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Venue</label>
              <select required className="admin-form-select" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})}>
                <option value="">Select a venue</option>
                {venues.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group md:col-span-2">
              <label className="admin-form-label">Description (Optional)</label>
              <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                <ReactQuill 
                  theme="snow"
                  value={formData.description}
                  onChange={content => { if (formData.description !== content) setFormData({...formData, description: content}) }}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline', 'strike'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link', 'clean']
                    ],
                  }}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="admin-form-actions md:col-span-2">
              <button type="button" onClick={handleClose} className="admin-button-secondary">Cancel</button>
              <button type="submit" className="admin-button-primary">{editingId ? 'Update Point' : 'Save Point'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="admin-table-header">
            <tr>
              <th className="admin-table-th">Location</th>
              <th className="admin-table-th">Venue</th>
              <th className="admin-table-th">Price</th>
              <th className="admin-table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
              {locations
                .filter(l => {
                  const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesVenue = !venueFilter || (typeof l.venue === 'object' && l.venue?._id === venueFilter) || (typeof l.venue === 'string' && l.venue === venueFilter);
                  return matchesSearch && matchesVenue;
                })
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(l => (
              <tr key={l._id} className="admin-table-tr">
                <td className="admin-table-td font-bold text-zinc-900">
                  <div className="font-bold text-zinc-900">{l.name}</div>
                  <div 
                    className="text-[10px] text-zinc-500 max-w-[300px] line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: l.description || '' }}
                  />
                </td>
                <td className="admin-table-td text-zinc-500">{l.venue?.name || '-'}</td>
                <td className="admin-table-td text-zinc-500 font-medium">€{Number(l.price || 0).toFixed(2)}</td>
                <td className="admin-table-td text-right flex gap-2 justify-end">
                  <button onClick={() => openEdit(l)} className="admin-button-secondary" title="Edit"><Pencil className="icon-w-4" /></button>
                  <button onClick={() => handleDelete(l._id)} className="admin-button-danger"><Trash2 className="icon-w-4" /></button>
                </td>
              </tr>
            ))}
            {locations.length === 0 && (
              <tr>
                <td colSpan={3} className="admin-table-td text-center text-zinc-400 py-8">No pickup points registered</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminSiteManagement = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchPage = (pageKey: string) => {
    setLoading(true);
    setFormData(null);
    api.get(`/site-settings/${pageKey}`)
      .then(res => setFormData(res.data))
      .catch(() => setFormData({ title: '', subtitle: '', description: '', image_url: '', button_text: '', button_link: '' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPage(selectedPage);
  }, [selectedPage]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    api.put(`/site-settings/${selectedPage}`, formData)
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        fetchPage(selectedPage);
      })
      .finally(() => setSaving(false));
  };

  return (
    <div>
      <h1 className="admin-page-title">PAGE MANAGEMENT</h1>

      <div className="admin-tabs">
        {['home', 'concerts', 'bus_info', 'about', 'contact'].map(page => (
          <button
            key={page}
            onClick={() => setSelectedPage(page)}
            className={`admin-tab ${selectedPage === page ? 'active' : ''}`}
          >
            {page.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-form-card flex items-center justify-center py-16 text-zinc-400">Loading...</div>
      ) : !formData ? null : (
        <div className="admin-form-card">
          <form onSubmit={handleSave} className="admin-form">
            {/* Title — always shown */}
            <div className="admin-form-group md:col-span-2">
              <label className="admin-form-label"><Type className="icon-w-4 inline mr-2" /> Title</label>
              <input className="admin-form-input" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            {selectedPage === 'contact' ? (
              <>
                {/* Intro text for Contact page */}
                <div className="admin-form-group md:col-span-2">
                  <label className="admin-form-label"><Type className="icon-w-4 inline mr-2" /> Intro Text</label>
                  <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={formData.description || ''}
                      onChange={content => { if (formData.description !== content) setFormData({...formData, description: content}) }}
                      className="min-h-[150px]"
                    />
                  </div>
                </div>

                {/* Separator */}
                <div className="admin-form-group md:col-span-2" style={{ borderTop: '1px solid #e4e4e7', paddingTop: '1.5rem', marginTop: '0.25rem' }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3f3f46', letterSpacing: '0.08em', marginBottom: '0' }}>CONTACT DETAILS</h3>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">📞 Phone</label>
                  <input className="admin-form-input" placeholder="+353 087 900 4876" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">✉️ Email</label>
                  <input className="admin-form-input" type="email" placeholder="info@ohaireconcertcoaches.ie" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="admin-form-group md:col-span-2">
                  <label className="admin-form-label">📍 Address</label>
                  <input className="admin-form-input" placeholder="Roscommon, Ireland" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>

                {/* Social */}
                <div className="admin-form-group md:col-span-2" style={{ borderTop: '1px solid #e4e4e7', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3f3f46', letterSpacing: '0.08em', marginBottom: '0' }}>SOCIAL MEDIA LINKS</h3>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Facebook URL</label>
                  <input className="admin-form-input" placeholder="https://facebook.com/..." value={formData.social_facebook || ''} onChange={e => setFormData({...formData, social_facebook: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Instagram URL</label>
                  <input className="admin-form-input" placeholder="https://instagram.com/..." value={formData.social_instagram || ''} onChange={e => setFormData({...formData, social_instagram: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Twitter / X URL</label>
                  <input className="admin-form-input" placeholder="https://twitter.com/..." value={formData.social_twitter || ''} onChange={e => setFormData({...formData, social_twitter: e.target.value})} />
                </div>
              </>
            ) : selectedPage === 'bus_info' ? (
              <>
                <div className="admin-form-group md:col-span-2">
                  <label className="admin-form-label"><Type className="icon-w-4 inline mr-2" /> PICKUP LOCATIONS &amp; MAP</label>
                  <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={formData.bus_pickup_locations || ''}
                      onChange={content => { if (formData.bus_pickup_locations !== content) setFormData({...formData, bus_pickup_locations: content}) }}
                    />
                  </div>
                </div>
                <div className="admin-form-group md:col-span-2">
                  <label className="admin-form-label"><Type className="icon-w-4 inline mr-2" /> Travel Rules &amp; Details</label>
                  <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={formData.bus_travel_rules || ''}
                      onChange={content => { if (formData.bus_travel_rules !== content) setFormData({...formData, bus_travel_rules: content}) }}
                    />
                  </div>
                </div>
                <div className="admin-form-group md:col-span-2">
                  <label className="admin-form-label"><Type className="icon-w-4 inline mr-2" /> VENUE DEPARTURE TIMES</label>
                  <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={formData.bus_venue_departure || ''}
                      onChange={content => { if (formData.bus_venue_departure !== content) setFormData({...formData, bus_venue_departure: content}) }}
                    />
                  </div>
                </div>
                
                <div className="admin-form-group md:col-span-2" style={{ borderTop: '1px solid #e4e4e7', paddingTop: '1.5rem', marginTop: '0.25rem' }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3f3f46', letterSpacing: '0.08em', marginBottom: '0' }}>BLUE CARD: NEED HELP &amp; POLICY</h3>
                </div>

                <div className="admin-form-group md:col-span-2">
                  <label className="admin-form-label"><Type className="icon-w-4 inline mr-2" /> Icon Need Help?</label>
                  <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={formData.bus_help_text || ''}
                      onChange={content => { if (formData.bus_help_text !== content) setFormData({...formData, bus_help_text: content}) }}
                    />
                  </div>
                </div>
                <div className="admin-form-group md:col-span-2">
                  <label className="admin-form-label"><Type className="icon-w-4 inline mr-2" /> Onboard Policy</label>
                  <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={formData.bus_policy_text || ''}
                      onChange={content => { if (formData.bus_policy_text !== content) setFormData({...formData, bus_policy_text: content}) }}
                    />
                  </div>
                </div>
              </>
            ) : selectedPage === 'about' ? (
              <div style={{ display: 'contents' }}>
                {/* Section: Our Story */}
                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <Type className="admin-section-icon" />
                    <h3>Hero & Our Story</h3>
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-input-wrapper" style={{ gridColumn: 'span 2' }}>
                      <label className="admin-input-label">Story Subtitle</label>
                      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                        <ReactQuill 
                          theme="snow"
                          value={formData.story_subtitle || ''}
                          onChange={content => { if (formData.story_subtitle !== content) setFormData({...formData, story_subtitle: content}) }}
                        />
                      </div>
                      <span className="admin-field-helper">This text appears on the About hero section.</span>
                    </div>
                  </div>
                </div>

                {/* Section: Info Cards */}
                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <Layout className="admin-section-icon" />
                    <h3>Value Proposition Cards</h3>
                  </div>
                  <div className="admin-grid-3">
                    {[1, 2, 3].map(num => (
                      <div key={num} className="admin-info-card-item">
                        <div className="admin-text-tiny-bold" style={{ color: 'var(--admin-accent)' }}>0{num}. CARD</div>
                        <div className="admin-input-wrapper">
                          <label className="admin-input-label">Icon</label>
                          <select 
                            className="admin-form-select admin-p-y-1" 
                            value={(formData as any)[`card${num}_icon`] || ''} 
                            onChange={e => setFormData({...formData, [`card${num}_icon`]: e.target.value})}
                          >
                            <option value="Bus">Bus</option>
                            <option value="Shield">Shield</option>
                            <option value="Clock">Clock</option>
                            <option value="MapPin">MapPin</option>
                            <option value="Users">Users</option>
                            <option value="Heart">Heart</option>
                          </select>
                        </div>
                        <div className="admin-input-wrapper">
                          <label className="admin-input-label">Title</label>
                          <input 
                            className="admin-form-input admin-p-y-1" 
                            placeholder="Card title..."
                            value={(formData as any)[`card${num}_title`] || ''} 
                            onChange={e => setFormData({...formData, [`card${num}_title`]: e.target.value})} 
                          />
                        </div>
                        <div className="admin-input-wrapper">
                          <label className="admin-input-label">Description</label>
                          <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                            <ReactQuill 
                              theme="snow"
                              value={(formData as any)[`card${num}_text`] || ''}
                              onChange={content => { if ((formData as any)[`card${num}_text`] !== content) setFormData({...formData, [`card${num}_text`]: content}) }}
                              modules={{ toolbar: [['bold', 'italic', 'underline', 'clean']] }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: The O'Haire Difference */}
                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <Plus className="admin-section-icon" />
                    <h3>The O'Haire Difference</h3>
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-input-wrapper" style={{ gridColumn: 'span 2' }}>
                      <label className="admin-input-label">Section Title</label>
                      <input 
                        className="admin-form-input" 
                        value={formData.diff_title || ''} 
                        onChange={e => setFormData({...formData, diff_title: e.target.value})} 
                      />
                    </div>
                    <div className="admin-input-wrapper">
                      <label className="admin-input-label">Paragraph 1</label>
                      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                        <ReactQuill 
                          theme="snow"
                          value={formData.diff_text1 || ''}
                          onChange={content => { if (formData.diff_text1 !== content) setFormData({...formData, diff_text1: content}) }}
                        />
                      </div>
                    </div>
                    <div className="admin-input-wrapper">
                      <label className="admin-input-label">Paragraph 2</label>
                      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                        <ReactQuill 
                          theme="snow"
                          value={formData.diff_text2 || ''}
                          onChange={content => { if (formData.diff_text2 !== content) setFormData({...formData, diff_text2: content}) }}
                        />
                      </div>
                    </div>
                    <div className="admin-input-wrapper" style={{ gridColumn: 'span 2' }}>
                      <label className="admin-input-label">Feature Image</label>
                      <div className="admin-image-upload-zone">
                        {formData.diff_image ? (
                          <img src={formData.diff_image} alt="Preview" className="admin-image-preview" style={{ width: '8rem', height: '6rem' }} />
                        ) : (
                          <div className="admin-image-preview admin-flex-center-gap" style={{ width: '8rem', height: '6rem', backgroundColor: '#f4f4f5', justifyContent: 'center' }}>
                            <ImageIcon className="text-zinc-300" />
                          </div>
                        )}
                        <div className="admin-space-y-3">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({ ...formData, diff_image: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="admin-file-picker"
                          />
                          <p className="admin-field-helper">Recommended: 800x600px, PNG or JPG.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Statistics */}
                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <LayoutDashboard className="admin-section-icon" />
                    <h3>Counter Statistics</h3>
                  </div>
                  <div className="admin-grid-3">
                    {[1, 2, 3].map(num => (
                      <div key={num} className="admin-stats-card">
                        <div className="admin-text-tiny-bold">STAT 0{num}</div>
                        <div className="admin-input-wrapper">
                          <label className="admin-input-label">Value</label>
                          <input 
                            className="admin-form-input" 
                            placeholder="e.g. 20k+"
                            value={(formData as any)[`stat${num}_value`] || ''} 
                            onChange={e => setFormData({...formData, [`stat${num}_value`]: e.target.value})} 
                          />
                        </div>
                        <div className="admin-input-wrapper">
                          <label className="admin-input-label">Label</label>
                          <input 
                            className="admin-form-input" 
                            placeholder="e.g. Happy Fans"
                            value={(formData as any)[`stat${num}_label`] || ''} 
                            onChange={e => setFormData({...formData, [`stat${num}_label`]: e.target.value})} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Standard fields for all other pages */}
                <div className="admin-form-group">
                  <label className="admin-form-label"><Type className="icon-w-4 inline mr-2" /> Subtitle</label>
                  <input className="admin-form-input" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                </div>

                {selectedPage !== 'concerts' && (
                  <>
                    <div className="admin-form-group md:col-span-2">
                      <label className="admin-form-label"><Type className="icon-w-4 inline mr-2" /> Description</label>
                      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                        <ReactQuill 
                          theme="snow"
                          value={formData.description || ''}
                          onChange={content => { if (formData.description !== content) setFormData({...formData, description: content}) }}
                        />
                      </div>
                    </div>
                    <div className="admin-form-group md:col-span-2">
                      <label className="admin-form-label"><ImageIcon className="icon-w-4 inline mr-2" /> Feature Image</label>
                      <div className="admin-image-upload-zone">
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="Preview" className="admin-image-preview" style={{ width: '8rem', height: '6rem', objectFit: 'cover' }} />
                        ) : (
                          <div className="admin-image-preview admin-flex-center-gap" style={{ width: '8rem', height: '6rem', backgroundColor: '#f4f4f5', justifyContent: 'center' }}>
                            <ImageIcon className="text-zinc-300" />
                          </div>
                        )}
                        <div className="admin-space-y-3" style={{ flex: 1 }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({ ...formData, image_url: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="admin-file-picker"
                          />
                          <input 
                            className="admin-form-input" 
                            placeholder="Ou colar URL da imagem..." 
                            value={formData.image_url || ''} 
                            onChange={e => setFormData({...formData, image_url: e.target.value})} 
                          />
                          <p className="admin-field-helper">Carregue um ficheiro ou cole o URL. Formato horizontal recomendado (ex: 1920x1080px).</p>
                        </div>
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label"><LinkIcon className="icon-w-4 inline mr-2" /> Button Text</label>
                      <input className="admin-form-input" value={formData.button_text || ''} onChange={e => setFormData({...formData, button_text: e.target.value})} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label"><LinkIcon className="icon-w-4 inline mr-2" /> Button Link</label>
                      <input className="admin-form-input" value={formData.button_link || ''} onChange={e => setFormData({...formData, button_link: e.target.value})} />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="admin-form-actions md:col-span-2">
              <button type="submit" className="admin-button-primary" disabled={saving}>
                {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const AdminComponentManagement = () => {
  const [headerSettings, setHeaderSettings] = useState<any>(null);
  const [footerSettings, setFooterSettings] = useState<any>(null);
  const [globalSettings, setGlobalSettings] = useState<any>(null);

  useEffect(() => {
    api.get('/component-settings/header').then(res => setHeaderSettings(res.data?.content || { logo_text: "O'HAIRE", logo_accent: 'COACHES' })).catch(() => setHeaderSettings({ logo_text: "O'HAIRE", logo_accent: 'COACHES' }));
    
    const defaultFooter = { 
      description: "Premium coach travel to Ireland's biggest events. Safe, reliable, and comfortable journeys since 2004.", 
      phone: "+353 (0) 87 900 4876", 
      email: "info@ohaire-coaches.ie", 
      address: "Roscommon, Ireland" 
    };
    
    api.get('/component-settings/footer')
       .then(res => setFooterSettings(res.data?.content || defaultFooter))
       .catch(() => setFooterSettings(defaultFooter));
       
    api.get('/component-settings/global')
       .then(res => setGlobalSettings(res.data?.content || { background_image: '/background.png' }))
       .catch(() => setGlobalSettings({ background_image: '/background.png' }));
  }, []);

  const saveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    api.put('/component-settings/header', { content: headerSettings })
      .then(() => alert('Header saved!'))
      .catch(err => {
        console.error("Error saving header:", err);
        alert('Failed to save header. Check console for details.');
      });
  };

  const saveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    api.put('/component-settings/footer', { content: footerSettings })
      .then(() => alert('Footer saved!'))
      .catch(err => {
        console.error("Error saving footer:", err);
        alert('Failed to save footer. Check console for details.');
      });
  };

  const saveGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    api.put('/component-settings/global', { content: globalSettings })
      .then(() => alert('Global settings saved!'))
      .catch(err => {
        console.error("Error saving global settings:", err);
        alert('Failed to save global settings. Check console for details.');
      });
  };

  if (!headerSettings || !footerSettings || !globalSettings) return <div>Loading...</div>;

  return (
    <div className="space-y-12">
      <section>
        <h1 className="admin-page-title">GLOBAL SETTINGS</h1>
        <div className="admin-form-card">
          <form onSubmit={saveGlobal} className="admin-form">
            <div className="admin-form-group md:col-span-2">
              <label className="admin-form-label"><ImageIcon className="icon-w-4 inline mr-2" /> Global Background Image</label>
              <div className="admin-image-upload-zone">
                {globalSettings.background_image ? (
                  <img src={globalSettings.background_image} alt="Preview" className="admin-image-preview" style={{ width: '8rem', height: '6rem', objectFit: 'cover' }} />
                ) : (
                  <div className="admin-image-preview admin-flex-center-gap" style={{ width: '8rem', height: '6rem', backgroundColor: '#f4f4f5', justifyContent: 'center' }}>
                    <ImageIcon className="text-zinc-300" />
                  </div>
                )}
                <div className="admin-space-y-3" style={{ flex: 1 }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setGlobalSettings({ ...globalSettings, background_image: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="admin-file-picker"
                  />
                  <input 
                    className="admin-form-input" 
                    placeholder="Ou colar URL da imagem..." 
                    value={globalSettings.background_image || ''} 
                    onChange={e => setGlobalSettings({...globalSettings, background_image: e.target.value})} 
                  />
                  <p className="admin-field-helper">Carregue um ficheiro ou cole o URL. Formato horizontal recomendado (ex: 1920x1080px). Esta imagem será aplicada com 30% de opacidade em todas as páginas.</p>
                </div>
              </div>
            </div>
            <div className="admin-form-actions md:col-span-2">
              <button type="submit" className="admin-button-primary">Save Background</button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <h1 className="admin-page-title">HEADER CONFIGURATION</h1>
        <div className="admin-form-card">
          <form onSubmit={saveHeader} className="admin-form">
            <div className="admin-form-group">
              <label className="admin-form-label">Logo Text</label>
              <input 
                className="admin-form-input" 
                value={headerSettings.logo_text} 
                onChange={e => setHeaderSettings({...headerSettings, logo_text: e.target.value})} 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Logo Accent</label>
              <input 
                className="admin-form-input" 
                value={headerSettings.logo_accent} 
                onChange={e => setHeaderSettings({...headerSettings, logo_accent: e.target.value})} 
              />
            </div>
            <div className="admin-form-actions md:col-span-2">
              <button type="submit" className="admin-button-primary">Save Header</button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <h1 className="admin-page-title">FOOTER CONFIGURATION</h1>
        <div className="admin-form-card">
          <form onSubmit={saveFooter} className="admin-form">
            <div className="admin-form-group md:col-span-2">
              <label className="admin-form-label">Footer Description</label>
              <textarea 
                className="admin-form-textarea" 
                value={footerSettings.description} 
                onChange={e => setFooterSettings({...footerSettings, description: e.target.value})} 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone</label>
              <input 
                className="admin-form-input" 
                value={footerSettings.phone} 
                onChange={e => setFooterSettings({...footerSettings, phone: e.target.value})} 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email</label>
              <input 
                className="admin-form-input" 
                value={footerSettings.email} 
                onChange={e => setFooterSettings({...footerSettings, email: e.target.value})} 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Address</label>
              <input 
                className="admin-form-input" 
                value={footerSettings.address} 
                onChange={e => setFooterSettings({...footerSettings, address: e.target.value})} 
              />
            </div>
            <div className="admin-form-actions md:col-span-2">
              <button type="submit" className="admin-button-primary">Save Footer</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

const AdminPayments = () => {
  const [stripeSettings, setStripeSettings] = useState<any>(null);

  useEffect(() => {
    api.get('/component-settings/stripe')
      .then(res => setStripeSettings(res.data?.content || { environment: 'sandbox' }))
      .catch(() => setStripeSettings({ environment: 'sandbox' }));
  }, []);

  const saveStripe = (e: React.FormEvent) => {
    e.preventDefault();
    let methods = stripeSettings.paymentMethodTypes;
    if (typeof methods === 'string') {
      methods = methods.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    const updatedSettings = {
      ...stripeSettings,
      paymentMethodTypes: methods && methods.length > 0 ? methods : ['card']
    };

    api.put('/component-settings/stripe', { content: updatedSettings })
      .then(() => alert('Stripe settings saved successfully!'));
  };

  if (!stripeSettings) return <div>Loading...</div>;

  return (
    <div className="space-y-12">
      <section>
        <h1 className="admin-page-title inline-flex items-center gap-2 mt-12">
          <CreditCard className="icon-w-6" /> STRIPE CHECKOUT
        </h1>
        <p className="text-sm text-zinc-500 mb-8">
          Configure the credentials for your Stripe integration. These keys are used securely on your backend.
        </p>

        <div className="admin-form-card">
          <form onSubmit={saveStripe} className="admin-form">
            <div className="admin-form-group">
              <label className="admin-form-label">Environment</label>
              <select 
                className="admin-form-select"
                value={stripeSettings.environment}
                onChange={e => setStripeSettings({...stripeSettings, environment: e.target.value})}
              >
                <option value="sandbox">Test Mode (Sandbox)</option>
                <option value="live">Live (Production)</option>
              </select>
            </div>
            
            <div className="admin-form-group md:col-span-2">
              <label className="admin-form-label">Publishable Key</label>
              <input 
                className="admin-form-input font-mono text-sm" 
                value={stripeSettings.publishableKey || ''} 
                onChange={e => setStripeSettings({...stripeSettings, publishableKey: e.target.value})} 
                placeholder="pk_test_..."
              />
            </div>

            <div className="admin-form-group md:col-span-2">
              <label className="admin-form-label">Secret Key</label>
              <input 
                type="password"
                className="admin-form-input font-mono text-sm" 
                value={stripeSettings.secretKey || ''} 
                onChange={e => setStripeSettings({...stripeSettings, secretKey: e.target.value})} 
                placeholder="sk_test_..."
              />
            </div>

            <div className="admin-form-group md:col-span-2 border-t border-zinc-100 pt-6 mt-2">
              <h3 className="text-sm font-bold text-zinc-800 mb-4">Checkout Experience</h3>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Booking Fee / Admin Fee (€)</label>
              <input 
                type="number"
                step="0.01"
                min="0"
                className="admin-form-input" 
                value={stripeSettings.bookingFee !== undefined ? stripeSettings.bookingFee : ''} 
                onChange={e => setStripeSettings({...stripeSettings, bookingFee: parseFloat(e.target.value) || 0})} 
                placeholder="2.50"
              />
            </div>

            <div className="admin-form-actions md:col-span-2 pt-4 border-t border-zinc-100">
              <button type="submit" className="admin-button-primary w-full">Save Stripe Settings</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <AdminDashboard />}
      {activeTab === 'events' && <AdminEvents />}
      {activeTab === 'venues' && <AdminVenues />}
      {activeTab === 'pickup' && <AdminPickup />}
      {activeTab === 'site' && <AdminSiteManagement />}
      {activeTab === 'components' && <AdminComponentManagement />}
      {activeTab === 'payments' && <AdminPayments />}
    </AdminLayout>
  );
}
