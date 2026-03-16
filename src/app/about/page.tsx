'use client';

import React, { useEffect, useState } from 'react';
import { Bus, Shield, Clock, MapPin, Users, Heart, Loader2 } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import api from '../../lib/api';
import './AboutPage.css';

const IconMap: any = {
  Bus, Shield, Clock, MapPin, Users, Heart
};

export default function AboutPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/site-settings/about')
      .then(res => setSettings(res.data))
      .catch(err => console.error('Error loading about settings:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="about-loading-container">
        <Loader2 className="about-loader" />
      </div>
    );
  }

  // Fallback to static values if settings not loaded
  const s = settings || {};

  return (
    <div className="app-wrapper">
      <Header />
      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-title" dangerouslySetInnerHTML={{ __html: s.title || 'OUR <span className="italic">STORY</span>' }} />
            <div className="about-subtitle" dangerouslySetInnerHTML={{ __html: s.story_subtitle || "Serving Ireland's concert fans for over two decades with reliability and passion." }} />
          </div>
        </section>

        <section className="about-info">
          <div className="info-grid">
            {[1, 2, 3].map(num => {
              const Icon = IconMap[s[`card${num}_icon`]] || Bus;
              return (
                <div key={num} className="info-card">
                  <Icon className="info-icon" />
                  <h3>{s[`card${num}_title`] || 'Section Title'}</h3>
                  <div className="card-text" dangerouslySetInnerHTML={{ __html: s[`card${num}_text`] || 'Section text describing our service and commitment to fans.' }} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="about-details">
          <div className="details-container">
            <div className="details-text">
              <h2>{s.diff_title || "The O'Haire Difference"}</h2>
              <div className="description-p" dangerouslySetInnerHTML={{ __html: s.diff_text1 || "Our fleet consists of modern, executive coaches equipped with comfortable seating, climate control, and experienced drivers who know Ireland's road networks better than anyone." }} />
              <div className="description-p" dangerouslySetInnerHTML={{ __html: s.diff_text2 || "Whether it's a small gig in the 3Arena or a massive festival in Marlay Park, we bring the same level of commitment and professionalism to every trip." }} />
              <div className="stats-grid">
                {[1, 2, 3].map(num => (
                  <div key={num} className="stat-item">
                    <span className="stat-number">{s[`stat${num}_value`] || '0'}</span>
                    <span className="stat-label">{s[`stat${num}_label`] || 'Label'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="details-image-wrapper">
              <img 
                src={s.diff_image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"} 
                alt="Our Coach" 
                className="details-image" 
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
