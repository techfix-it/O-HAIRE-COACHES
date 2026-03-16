'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bus, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import api from '../lib/api';
import './Footer.css';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    api.get('/component-settings/footer')
      .then(res => setSettings(res.data?.content || {
        companyName: "O'Haire Concert Coaches",
        description: "Premium coach travel to Ireland's biggest events. Safe, reliable, and comfortable journeys since 2004.",
        email: "info@ohaire-coaches.ie",
        phone: "+353 (0) 87 900 4876",
        address: "Roscommon, Ireland",
        social_links: {
          facebook: "https://facebook.com",
          instagram: "https://instagram.com",
          twitter: "https://twitter.com"
        }
      }))
      .catch(err => {
        console.error("Error fetching footer settings:", err);
        setSettings({
          companyName: "O'Haire Concert Coaches",
          description: "Premium coach travel to Ireland's biggest events. Safe, reliable, and comfortable journeys since 2004.",
          email: "info@ohaire-coaches.ie",
          phone: "+353 (0) 87 900 4876",
          address: "Roscommon, Ireland",
          social_links: {
            facebook: "https://facebook.com",
            instagram: "https://instagram.com",
            twitter: "https://twitter.com"
          }
        });
      });
  }, []);

  if (!settings) return null;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <Link href="/" className="footer-logo">
              <Bus className="footer-logo-icon" />
              O'HAIRE <span className="footer-logo-accent">COACHES</span>
            </Link>
            <p className="footer-desc">
              {settings.description}
            </p>
            <div className="social-links">
              <a href={settings.social_links.facebook} className="social-link"><Facebook className="icon-w-5" /></a>
              <a href={settings.social_links.instagram} className="social-link"><Instagram className="icon-w-5" /></a>
              <a href={settings.social_links.twitter} className="social-link"><Twitter className="icon-w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              <li><Link href="/concerts" className="footer-list-link">Upcoming Concerts</Link></li>
              <li><Link href="/bus-info" className="footer-list-link">Bus Information</Link></li>
              <li><Link href="/about" className="footer-list-link">About Our Service</Link></li>
              <li><Link href="/contact" className="footer-list-link">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-list">
              <li><Link href="/account" className="footer-list-link">My Bookings</Link></li>
              <li><a href="#" className="footer-list-link">Terms & Conditions</a></li>
              <li><a href="#" className="footer-list-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-list-link">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Contact Info</h4>
            <ul className="footer-list">
              <li className="contact-item">
                <Phone className="contact-icon" /> 
                <a href={`tel:${settings.phone}`} className="footer-list-link">{settings.phone}</a>
              </li>
              <li className="contact-item">
                <Mail className="contact-icon" /> 
                <a href={`mailto:${settings.email}`} className="footer-list-link">{settings.email}</a>
              </li>
              <li className="contact-item-start">
                <MapPin className="contact-icon contact-icon-mt" /> 
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-list-link"
                >
                  {settings.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} O'Haire Concert Coaches. All rights reserved.</p>
          <div className="payment-methods">
            <svg className="payment-icon" viewBox="0 0 38 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '24px', width: 'auto' }}>
              <path d="M14.6148 0.20166H11.5168C11.054 0.20166 10.636 0.46366 10.45 0.90266L6.59277 10.1507H10.5968L11.3978 7.90166H16.3318L16.8048 10.1507H20.4048L17.5878 0.20166H14.6148ZM12.4488 4.98166C12.5648 4.67166 13.5188 2.06266 13.5188 2.06266C13.5018 2.08666 13.7918 1.25866 13.8828 0.95766L14.4908 3.86466C14.4908 3.86466 15.3418 7.90166 15.3958 8.16966H12.4238L12.4488 4.98166Z" fill="#1434CB"/>
              <path d="M28.4687 0.20166H25.3217L22.1937 10.1507H25.9627L28.4687 0.20166Z" fill="#1434CB"/>
              <path d="M37.1064 0.20166H34.4234C33.9104 0.20166 33.4354 0.47966 33.2034 0.94566L28.1754 10.1507H32.1154L32.9034 7.96266H37.7564L38.2044 10.1507H41.7244L38.9054 0.20166H37.1064ZM33.9454 5.06866L35.4384 0.94866L36.4254 5.73366H33.9454Z" fill="#1434CB"/>
              <path d="M9.42938 10.1507H5.66038L3.52838 2.76866C3.41438 2.37366 3.10238 2.08666 2.69738 2.00066L0.0883789 1.55166L0.244379 0.20166H5.21338C5.70238 0.20166 6.13638 0.53666 6.25738 1.05066L7.54538 7.23466L10.3804 0.20166H14.1774L9.42938 10.1507Z" fill="#F5A623"/>
            </svg>
            <svg className="payment-icon" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '24px', width: 'auto' }}>
              <circle cx="10" cy="10" r="10" fill="#EB001B"/>
              <circle cx="22" cy="10" r="10" fill="#F79E1B"/>
              <path d="M16 18C13.8 18 11.9 16.6 11 14.8C11.6 13.9 12 12.8 12 11.6C12 9.8 11 8.2 9.6 7.3C10.7 5.3 12.9 4 15.3 4C17.7 4 19.9 5.3 21 7.3C19.6 8.2 18.6 9.8 18.6 11.6C18.6 12.8 19 13.9 19.6 14.8C18.7 16.6 16.8 18 16 18Z" fill="#FF5F00"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};
