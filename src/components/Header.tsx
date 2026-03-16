'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Bus, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import './Header.css';

interface HeaderProps {
  // Option to pass a different logo or color theme
  theme?: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({ theme = 'light' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const pathname = usePathname();
  const { user, logout, cart } = useAuth();
  
  const cartCount = cart.length;

  useEffect(() => {
    // Fetch dynamic header settings
    // Note: In Next.js we might want to fetch this on the server, 
    // but for now keeping it as a client-side fetch for parity.
    api.get('/component-settings/header')
      .then(res => setSettings(res.data?.content || {
        logo_text: "O'HAIRE",
        logo_accent: "COACHES",
        nav_links: [
          { id: 1, text: 'Home', link: '/' },
          { id: 2, text: 'Concerts', link: '/concerts' },
          { id: 3, text: 'Pickup Info', link: '/bus-info' },
          { id: 4, text: 'About', link: '/about' },
          { id: 5, text: 'Contact', link: '/contact' }
        ]
      }))
      .catch(err => {
        console.error("Error fetching header settings:", err);
        // Fallback
        setSettings({
          logo_text: "O'HAIRE",
          logo_accent: "COACHES",
          nav_links: [
            { id: 1, text: 'Home', link: '/' },
            { id: 2, text: 'Concerts', link: '/concerts' },
            { id: 3, text: 'Pickup Info', link: '/bus-info' },
            { id: 4, text: 'About', link: '/about' },
            { id: 5, text: 'Contact', link: '/contact' }
          ]
        });
      });
  }, []);

  if (!settings) return null;

  return (
    <nav className="header-nav">
      <div className="header-container">
        <Link href="/" className="logo-link">
          <Bus className="logo-icon" />
          {settings.logo_text} <span className="logo-accent">{settings.logo_accent}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          {settings.nav_links.map((link: any, i: number) => (
            <Link key={i} href={link.link} className="nav-link">{link.text}</Link>
          ))}
        </div>

        <div className="header-actions">
          <Link href="/cart" className="action-link">
            <ShoppingCart className="icon-w-6" />
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/account" className="action-link hidden-md">
            <User className="icon-w-6" />
          </Link>
          <button 
            className="menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="icon-w-6" /> : <Menu className="icon-w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {settings.nav_links.map((link: any, i: number) => (
            <Link key={i} href={link.link} onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">{link.text}</Link>
          ))}
          <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">My Account</Link>
        </div>
      )}
    </nav>
  );
};
