'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import './ContactPage.css';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  React.useEffect(() => {
    import('../../lib/api').then(api => {
      api.default.get('/site-settings/contact')
        .then(res => setSettings(res.data))
        .catch(err => console.error('Error loading contact settings:', err));
    });
  }, []);

  const s = settings || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app-wrapper">
      <Header />
      <main className="contact-page">
        <div className="contact-container">
          <div className="contact-grid">
            <div className="contact-info-section">
              <h1 className="contact-title" dangerouslySetInnerHTML={{ __html: s.title || 'GET IN <span className="italic">TOUCH</span>' }} />
              <div 
                className="contact-desc"
                dangerouslySetInnerHTML={{ __html: s.description || "Have questions about a booking or pickup point? We're here to help." }} 
              />
              
              <div className="contact-methods">
                <div className="method-item">
                  <div className="method-icon-wrapper">
                    <Phone className="method-icon" />
                  </div>
                  <div>
                    <div className="method-label">Call Us</div>
                    <div className="method-value">{s.phone || '+353 087 900 4876'}</div>
                  </div>
                </div>
                
                <div className="method-item">
                  <div className="method-icon-wrapper">
                    <Mail className="method-icon" />
                  </div>
                  <div>
                    <div className="method-label">Email Us</div>
                    <div className="method-value">{s.email || 'info@ohaireconcertcoaches.ie'}</div>
                  </div>
                </div>
                
                <div className="method-item">
                  <div className="method-icon-wrapper">
                    <MapPin className="method-icon" />
                  </div>
                  <div>
                    <div className="method-label">Visit Us</div>
                    <div className="method-value">{s.address || 'Roscommon, Ireland'}</div>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <p className="social-label">Follow our updates</p>
                <div className="social-icons">
                  {s.social_facebook && <a href={s.social_facebook} target="_blank" className="social-icon-btn">FB</a>}
                  {s.social_instagram && <a href={s.social_instagram} target="_blank" className="social-icon-btn">IG</a>}
                  {s.social_twitter && <a href={s.social_twitter} target="_blank" className="social-icon-btn">TW</a>}
                  {!s.social_facebook && !s.social_instagram && !s.social_twitter && (
                    <>
                      <a href="#" className="social-icon-btn">FB</a>
                      <a href="#" className="social-icon-btn">IG</a>
                      <a href="#" className="social-icon-btn">TW</a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon-bg">
                    <Send className="success-send-icon" />
                  </div>
                  <h2>Message Sent!</h2>
                  <p>We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group-grid">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" placeholder="John" required />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@example.com" required />
                  </div>
                  
                  <div className="form-group">
                    <label>Message</label>
                    <textarea placeholder="How can we help you?" rows={5} required></textarea>
                  </div>
                  
                  <button type="submit" className="submit-button">
                    Send Message <Send className="icon-w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
