'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import './QuickBook.css';

interface PickupLocation {
  _id: string;
  name: string;
  description?: string;
}

interface Route {
  _id: string;
  pickupLocation: PickupLocation;
  departureTime: string;
  price: number;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
  image_url?: string;
  routes?: Route[];
}

export function QuickBook() {
  const router = useRouter();
  const { addToCart } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/events').then(res => setEvents(res.data)).catch(() => {});
  }, []);

  const selectedEvent = events.find(e => e._id === selectedEventId);
  const routes = selectedEvent?.routes ?? [];
  const selectedRoute = routes.find(r => r._id === selectedRouteId);

  const handleBook = () => {
    if (!selectedEvent || !selectedRoute) return;

    setSubmitting(true);
    addToCart({
      eventId: selectedEvent._id,
      eventTitle: selectedEvent.title,
      eventImage: selectedEvent.imageUrl || selectedEvent.image_url,
      eventDate: formatCartDate(selectedEvent.date),
      pickupName: selectedRoute.pickupLocation?.name,
      price: Number(selectedRoute.price),
      unitPrice: Number(selectedRoute.price),
      routeId: selectedRoute._id,
    }, passengers);
    router.push('/cart');
  };

  const formatCartDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="quick-book-bar">
      {/* Event */}
      <div className="qb-field">
        <label className="qb-label">Event</label>
        <div className="qb-select-wrap">
          <select
            className="qb-select"
            value={selectedEventId}
            onChange={e => { setSelectedEventId(e.target.value); setSelectedRouteId(''); }}
          >
            <option value="">Select event</option>
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.title}</option>
            ))}
          </select>
          <ChevronDown className="qb-chevron" />
        </div>
      </div>

      <div className="qb-divider" />

      {/* Date */}
      <div className="qb-field">
        <label className="qb-label">Date</label>
        <div className="qb-select-wrap">
          <select className="qb-select" disabled>
            <option>
              {selectedEvent ? formatDate(selectedEvent.date) : 'No date available'}
            </option>
          </select>
          <ChevronDown className="qb-chevron" />
        </div>
      </div>

      <div className="qb-divider" />

      {/* Pickup */}
      <div className="qb-field">
        <label className="qb-label">Pickup Point</label>
        <div className="qb-select-wrap">
          <select
            className="qb-select"
            value={selectedRouteId}
            onChange={e => setSelectedRouteId(e.target.value)}
            disabled={!selectedEventId || routes.length === 0}
          >
            <option value="">Select Pickup point</option>
            {routes.map(r => (
              <option key={r._id} value={r._id}>
                — {r.pickupLocation?.name}{r.pickupLocation?.description ? `: ${r.pickupLocation.description}` : ''} - {r.departureTime} - €{Number(r.price).toFixed(2)}
              </option>
            ))}
          </select>
          <ChevronDown className="qb-chevron" />
        </div>
      </div>

      <div className="qb-divider" />

      {/* Passengers */}
      <div className="qb-field">
        <label className="qb-label">Passengers</label>
        <div className="qb-select-wrap">
          <select
            className="qb-select"
            value={passengers}
            onChange={e => setPassengers(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
            ))}
          </select>
          <ChevronDown className="qb-chevron" />
        </div>
      </div>

      {/* CTA */}
      <button
        className={`qb-cta ${(!selectedEventId || !selectedRouteId) ? 'disabled' : ''}`}
        onClick={handleBook}
        disabled={!selectedEventId || !selectedRouteId || submitting}
      >
        <Zap className="qb-cta-icon" />
        Quick Book
      </button>
    </div>
  );
}
