'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { PhoneInput } from '../../components/PhoneInput/PhoneInput';
import './ContactPage.css';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
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
    // Here would be the actual API call
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
                <a href={`tel:${s.phone || '+3530879004876'}`} className="method-item">
                  <div className="method-icon-wrapper">
                    <Phone className="method-icon" />
                  </div>
                  <div>
                    <div className="method-label">Call Us</div>
                    <div className="method-value">{s.phone || '+353 087 900 4876'}</div>
                  </div>
                </a>
                
                <a href={`mailto:${s.email || 'info@ohaireconcertcoaches.ie'}`} className="method-item">
                  <div className="method-icon-wrapper">
                    <Mail className="method-icon" />
                  </div>
                  <div>
                    <div className="method-label">Email Us</div>
                    <div className="method-value">{s.email || 'info@ohaireconcertcoaches.ie'}</div>
                  </div>
                </a>
                
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
              <h2 className="form-heading">Send us a Message</h2>
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
                  <div className="form-group">
                    <label>Name</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="John Doe" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="john@example.com" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="label-with-optional">
                      Phone <span className="optional-tag">— optional</span>
                    </label>
                    <PhoneInput 
                      value={formData.phone}
                      onChange={(val) => setFormData(p => ({ ...p, phone: val }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      placeholder="Project Inquiry" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Message</label>
                    <textarea 
                      name="message"
                      placeholder="Tell us about your project..." 
                      rows={5} 
                      required
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="submit-button-large">
                    Send Message
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
