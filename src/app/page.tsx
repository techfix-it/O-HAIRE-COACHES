'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { EventCard } from '../components/EventCard/EventCard';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import api from '../lib/api';
import './HomePage.css';

const DEFAULT_SETTINGS = {
  title: "GET THERE WITH O'HAIRE",
  description: "Premium return coach services to Ireland's biggest concerts and festivals. From Roscommon to the stage front.",
  image_url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1920",
  button_text: "Browse Concerts",
  button_link: "/concerts"
};

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/events').then(res => res.data).catch(() => []),
      api.get('/site-settings/home').then(res => res.data).catch(() => null)
    ]).then(([eventsData, settingsData]) => {
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      if (settingsData) setSettings(settingsData);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching home data:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="app-wrapper">
      <Header />
      <main className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg">
            <img 
              src={settings.image_url || "https://picsum.photos/seed/concert-hero/1920/1080?blur=2"} 
              alt="Hero" 
              className="hero-image"
            />
            <div className="hero-overlay" />
          </div>

          <div className="hero-content">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-text-wrapper"
            >
              <h1 className="hero-title">
                {settings.title}
              </h1>
              <div 
                className="hero-subtitle"
                dangerouslySetInnerHTML={{ __html: settings.description }} 
              />
              <div className="hero-buttons">
                {settings.button_text && (
                  <Link href={settings.button_link} className="btn-primary">
                    {settings.button_text}
                  </Link>
                )}
                <Link href="/bus-info" className="btn-secondary">
                  Pickup Points
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-bar" />
          </div>
        </section>

        {/* Featured Events */}
        <section className="featured-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">FEATURED <span className="text-primary italic">EVENTS</span></h2>
              <p className="section-subtitle">The biggest shows coming to Ireland this season.</p>
            </div>
            <Link href="/concerts" className="view-all-link">
              View All <ChevronRight className="icon-w-4" />
            </Link>
          </div>

          <div className="events-grid">
            {events.slice(0, 6).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="trust-section">
          <div className="trust-container">
            <div className="trust-item">
              <div className="trust-number">20+</div>
              <div className="trust-label">Years Experience</div>
              <p className="trust-desc">Trusted by thousands of fans every year since 2004.</p>
            </div>
            <div className="trust-item">
              <div className="trust-number">100%</div>
              <div className="trust-label">Reliability</div>
              <p className="trust-desc">We've never missed a show. Your seat is guaranteed.</p>
            </div>
            <div className="trust-item">
              <div className="trust-number">50+</div>
              <div className="trust-label">Pickup Points</div>
              <p className="trust-desc">Convenient locations across the entire country.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
