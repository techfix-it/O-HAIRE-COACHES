'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { EventCard } from '../../components/EventCard/EventCard';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { QuickBook } from '../../components/QuickBook/QuickBook';
import api from '../../lib/api';
import './ConcertsPage.css';

export default function ConcertsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuickBook, setShowQuickBook] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, settingsRes] = await Promise.all([
          api.get('/events'),
          api.get('/site-settings/concerts').catch(() => ({
            data: {
              title: "UPCOMING CONCERTS",
              subtitle: "Book your coach to the biggest shows in Ireland."
            }
          }))
        ]);
        setEvents(eventsRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error("Error fetching concerts data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.venue?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-wrapper">
      <Header />
      <main className="concerts-page">
        <div className="concerts-container">
          <div className="concerts-header">
            <div>
              <h1 className="concerts-title">
                {settings?.title || "UPCOMING CONCERTS"}
              </h1>
              <p className="concerts-subtitle">
                {settings?.subtitle || "Book your coach to the biggest shows in Ireland."}
              </p>
            </div>

            <div className="search-filter-wrapper">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search events or venues..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                id="filter-button"
                className={`filter-button ${showQuickBook ? 'active' : ''}`}
                onClick={() => setShowQuickBook(v => !v)}
                aria-label="Toggle Quick Book"
                title="Quick Book"
              >
                <SlidersHorizontal className="filter-icon" />
              </button>
            </div>
          </div>

          {/* Quick Book sliding panel */}
          <div className={`quick-book-panel ${showQuickBook ? 'open' : ''}`}>
            <QuickBook />
          </div>

          {loading ? (
            <div className="concerts-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-pulse" />
              ))}
            </div>
          ) : (
            <>
              {filteredEvents.length > 0 ? (
                <div className="concerts-grid">
                  {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p className="no-results-text">No concerts found matching your search.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
