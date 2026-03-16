'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import './EventCard.css';

interface BusRoute {
  id: number;
  event_id: number;
  pickup_location_id: number;
  pickup_name: string;
  departure_time: string;
  price: number;
  capacity: number;
  booked: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
  venue_id: number;
  venue_name: string;
  description: string;
  image_url: string;
  imageUrl?: string;
  price: number;
  routes?: BusRoute[];
}

export const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="event-card"
  >
    <div className="event-card-image-wrapper">
      <img 
        src={event.imageUrl || event.image_url || `https://picsum.photos/seed/${event.id}/800/450`} 
        alt={event.title}
        className="event-card-image"
      />
      <div className="event-card-badge">
        {event.venue_name}
      </div>
    </div>
    <div className="event-card-content">
      <div className="event-card-date">
        <Calendar className="icon-w-3" />
        {format(new Date(event.date), 'MMM dd, yyyy')}
      </div>
      <h3 className="event-card-title">{event.title}</h3>
      <div className="event-card-venue">
        <MapPin className="icon-w-4" />
        {event.venue_name}
      </div>
      <Link 
        href={`/event/${event.id}`}
        className="event-card-button"
      >
        Book Coach <ChevronRight className="icon-w-4" />
      </Link>
    </div>
  </motion.div>
);
