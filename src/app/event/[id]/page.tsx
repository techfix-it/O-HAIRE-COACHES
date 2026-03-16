'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Bus, Clock, Info, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import api from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { unescapeHTML, formatRichText } from '../../../lib/utils';
import './EventDetailsPage.css';

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { addToCart } = useAuth();
  
  const [event, setEvent] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleAddToCart = () => {
    if (!event || !selectedRoute) return;
    const route = event.routes?.find((r: any) => r._id === selectedRoute);
    if (!route) return;

    addToCart({
      eventId: event._id,
      eventTitle: event.title,
      eventImage: event.imageUrl || event.image_url,
      eventDate: new Date(event.date).toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' }),
      pickupName: route.pickupLocation?.name || route.pickup_name,
      price: Number(route.price),
      unitPrice: Number(route.price),
      routeId: route._id
    });
    
    router.push('/cart');
  };

  if (loading) return <div className="loading-screen">Loading Event Details...</div>;
  if (!event) return <div className="error-screen">Event not found.</div>;

  return (
    <div className="app-wrapper">
      <Header />
      <main className="event-details-page">
        <div className="event-details-container">
          <Link href="/concerts" className="back-link">
            <ChevronRight className="icon-w-4 rotate-180" /> Back to Concerts
          </Link>

          <div className="event-details-grid">
            <div>
              <div className="event-hero-card">
                <img 
                  src={event.imageUrl || event.image_url || `https://picsum.photos/seed/${event.id}/1200/600`} 
                  alt={event.title}
                  className="event-hero-image"
                />
                <div className="event-hero-gradient" />
                <div className="event-hero-content">
                  <h1 className="event-hero-title">{event.title}</h1>
                  <div className="event-hero-meta">
                    <span className="meta-badge">
                      <Calendar className="meta-icon" />
                      {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
                    </span>
                    <span className="meta-badge">
                      <MapPin className="meta-icon" />
                      {event.venue?.name || event.venue_name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="event-description-section">
                <h2 className="section-title">About the Event</h2>
                {event.description ? (
                  <div 
                    className="description-content rich-text-content"
                    dangerouslySetInnerHTML={{ __html: formatRichText(event.description) }} 
                  />
                ) : (
                  <p className="description-text">
                    Join us for an unforgettable experience. Our coaches provide direct transport from multiple locations across the country.
                  </p>
                )}
              </div>
            </div>

            <div className="booking-sidebar">
              <h3 className="sidebar-title">
                <Bus className="icon-w-5 text-primary" />
                Select Pickup Location
              </h3>
              
              <div className="route-options">
                {event.routes?.map((route: any) => (
                  <button
                    key={route._id}
                    onClick={() => setSelectedRoute(route._id)}
                    className={`route-button ${selectedRoute === route._id ? 'active' : ''}`}
                  >
                    <div>
                      <div className="route-name">{route.pickupLocation?.name}</div>
                      <div className="route-time">
                        <Clock className="icon-w-3" /> Departs: {route.departureTime}
                      </div>
                    </div>
                    <div className="route-price">€{route.price}</div>
                  </button>
                ))}
                {(!event.routes || event.routes.length === 0) && (
                  <div className="text-center py-8 text-zinc-400 italic">
                    No coach routes available for this event yet.
                  </div>
                )}
              </div>

              <button 
                disabled={!selectedRoute}
                onClick={handleAddToCart}
                className="add-to-cart-button"
              >
                Add to Cart
              </button>
              
              <div className="info-box">
                <Info className="info-icon" />
                <p>Tickets are for coach travel only. Event tickets must be purchased separately. Coaches depart 40 minutes after the event ends.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
