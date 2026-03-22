'use client';

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Info, ChevronDown, Phone, User, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import api from '../../lib/api';
import './BusInfoPage.css';

const VENUE_TIMES = [
  {
    name: "3 Arena",
    image: "https://picsum.photos/seed/3arena/800/400",
    times: [
      { location: "Longford (Battery Road, Adjacent to Garda Station)", time: "3:15pm" },
      { location: "Edgeworthstown (Bus Stop across from Girasoles)", time: "3:30pm" },
      { location: "Mullingar (St. Marys Hospital Bus Stop)", time: "3:45pm" },
      { location: "Roscommon (Caseys Supermacs)", time: "3:00pm" },
      { location: "Lanesboro (Main Street - Lanesbrew Coffee)", time: "3:15pm" },
      { location: "Ballymahon (Car Park across from Nallys Circle K)", time: "3:30pm" }
    ]
  },
  {
    name: "Aviva Stadium",
    image: "https://picsum.photos/seed/aviva/800/400",
    times: [
      { location: "Longford (Battery Road, Adjacent to Garda Station)", time: "2:00pm" },
      { location: "Edgeworthstown (Bus Stop across from Girasoles)", time: "2:15pm" },
      { location: "Mullingar (St. Marys Hospital Bus Stop)", time: "3:00pm" },
      { location: "Roscommon (Caseys Supermacs)", time: "2:00pm" },
      { location: "Lanesboro (Main Street - Lanesbrew Coffee)", time: "2:15pm" },
      { location: "Ballymahon (Car Park across from Nallys Circle K)", time: "2:30pm" }
    ]
  },
  {
    name: "Croke Park",
    image: "https://picsum.photos/seed/croke/800/400",
    times: [
      { location: "Longford (Battery Road, Adjacent to Garda Station)", time: "1:15pm" },
      { location: "Edgeworthstown (Bus Stop across from Girasoles)", time: "1:30pm" },
      { location: "Mullingar (St. Marys Hospital Bus Stop)", time: "2:15pm" },
      { location: "Roscommon (Caseys Supermacs)", time: "1:15pm" },
      { location: "Lanesboro (Main Street - Lanesbrew Coffee)", time: "2:15pm" },
      { location: "Ballymahon (Car Park across from Nallys Circle K)", time: "1:45pm" }
    ]
  },
  {
    name: "Malahide Castle",
    image: "https://picsum.photos/seed/malahide/800/400",
    times: [
      { location: "Longford (Battery Road, Adjacent to Garda Station)", time: "1:45pm" },
      { location: "Edgeworthstown (Bus Stop across from Girasoles)", time: "2:00pm" },
      { location: "Mullingar (St. Marys Hospital Bus Stop)", time: "2:30pm" },
      { location: "Roscommon (Caseys Supermacs)", time: "1:30pm" },
      { location: "Lanesboro (Main Street - Lanesbrew Coffee)", time: "1:45pm" },
      { location: "Ballymahon (Car Park across from Nallys Circle K)", time: "2:00pm" }
    ]
  },
  {
    name: "Marlay Park",
    image: "https://picsum.photos/seed/marlay/800/400",
    times: [
      { location: "Longford (Battery Road, Adjacent to Garda Station)", time: "TBC" },
      { location: "Edgeworthstown (Bus Stop across from Girasoles)", time: "TBC" },
      { location: "Mullingar (St. Marys Hospital Bus Stop)", time: "TBC" },
      { location: "Roscommon (Caseys Supermacs)", time: "TBC" },
      { location: "Lanesboro (Main Street - Lanesbrew Coffee)", time: "TBC" },
      { location: "Ballymahon (Car Park across from Nallys Circle K)", time: "TBC" }
    ]
  },
  {
    name: "St. Anne's Park",
    image: "https://picsum.photos/seed/stannes/800/400",
    times: [
      { location: "Longford (Battery Road, Adjacent to Garda Station)", time: "TBC" },
      { location: "Edgeworthstown (Bus Stop across from Girasoles)", time: "TBC" },
      { location: "Mullingar (St. Marys Hospital Bus Stop)", time: "TBC" },
      { location: "Roscommon (Caseys Supermacs)", time: "TBC" },
      { location: "Lanesboro (Main Street - Lanesbrew Coffee)", time: "TBC" },
      { location: "Ballymahon (Car Park across from Nallys Circle K)", time: "TBC" }
    ]
  }
];

const PICKUP_LOCATIONS = [
  {
    id: 1,
    name: "Longford",
    address: "Battery Road, Longford, Adjacent to Garda Station",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.8!2d-7.8!3d53.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485dd!2sBattery%20Rd%2C%20Longford!5e0!3m2!1sen!2sie!4v1234567890"
  },
  {
    id: 2,
    name: "Edgeworthstown",
    address: "Bus Stop across from Girasoles",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.8!2d-7.6!3d53.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485dd!2sEdgeworthstown!5e0!3m2!1sen!2sie!4v1234567890"
  },
  {
    id: 3,
    name: "Mullingar",
    address: "St. Mary's Hospital Bus Stop",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.8!2d-7.3!3d53.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485dd!2sMullingar!5e0!3m2!1sen!2sie!4v1234567890"
  },
  {
    id: 4,
    name: "Roscommon",
    address: "Caseys Supermacs Roscommon",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.8!2d-8.2!3d53.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485dd!2sRoscommon!5e0!3m2!1sen!2sie!4v1234567890"
  },
  {
    id: 5,
    name: "Lanesboro",
    address: "Main Street (Lanesbrew Coffee)",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.8!2d-7.9!3d53.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485dd!2sLanesboro!5e0!3m2!1sen!2sie!4v1234567890"
  },
  {
    id: 6,
    name: "Ballymahon",
    address: "Car Park across from Nallys Circle K",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.8!2d-7.7!3d53.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485dd!2sBallymahon!5e0!3m2!1sen!2sie!4v1234567890"
  }
];

export default function BusInfoPage() {
  const [settings, setSettings] = useState<any>(null);
  const [selectedVenue, setSelectedVenue] = useState(VENUE_TIMES[0]);
  const [selectedPickup, setSelectedPickup] = useState(PICKUP_LOCATIONS[0]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    api.get('/site-settings/bus_info')
      .then(res => setSettings(res.data))
      .catch(err => {
        console.error("Error fetching bus info settings:", err);
        setSettings({
          title: "PICKUP POINTS & TIMES",
          subtitle: "Loading Fallback..."
        });
      });
  }, []);

  if (!settings) return <div className="loading-screen">Loading...</div>;

  const rules = [
    {
      title: "Departure Times",
      desc: "Coaches depart 40 minutes after the concert ends. This allows plenty of time to exit the venue and locate the bus."
    },
    {
      title: "Contact Information",
      desc: "If you have any difficulty locating the bus, please contact Anthony on +353 (0) 87 900 4876. The driver's name and contact number will also be clearly displayed on the bus."
    },
    {
      title: "Guaranteed Seat",
      desc: "Pre-booked seats mean no standing around and no uncertainty. Your seat is guaranteed once you book online."
    },
    {
      title: "Stress-Free Travel",
      desc: "Skip the hassle of driving, parking, and late-night public transport. We get you there and home safely."
    }
  ];

  return (
    <div className="app-wrapper">
      <Header />
      <main className="bus-info-page">
        <div className="bus-info-container">
          <div className="bus-info-header">
            <h1 className="bus-info-title">
              {settings.title}
            </h1>
            <div 
              className="bus-info-subtitle"
              dangerouslySetInnerHTML={{ __html: settings.subtitle || "Serving Ireland's concert fans for over two decades with reliability and passion." }} 
            />
          </div>

          {/* Venue Departure Times Section */}
          <div className="section-spacer">
            <h2 className="section-heading">
              <Clock className="icon-xl" /> VENUE DEPARTURE TIMES
            </h2>
            {settings.bus_venue_departure && (
              <div 
                className="rich-text-content info-box"
                dangerouslySetInnerHTML={{ __html: settings.bus_venue_departure }} 
              />
            )}
            <div className="venue-grid">
              <div className="venue-list">
                {VENUE_TIMES.map((venue) => (
                  <button
                    key={venue.name}
                    onClick={() => setSelectedVenue(venue)}
                    className={`venue-button ${selectedVenue.name === venue.name ? 'active' : ''}`}
                  >
                    {venue.name}
                    {selectedVenue.name === venue.name && <ChevronDown className="icon-sm rotate-90-icon" />}
                  </button>
                ))}
              </div>
              <div className="venue-schedule-wrapper">
                <motion.div 
                  key={selectedVenue.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="venue-schedule-card"
                >
                  <div className="venue-schedule-hero">
                    <img 
                      src={selectedVenue.image} 
                      alt={selectedVenue.name}
                      className="venue-schedule-image"
                      referrerPolicy="no-referrer"
                    />
                    <div className="venue-schedule-overlay">
                      <h3 className="venue-schedule-title">{selectedVenue.name} Schedule</h3>
                    </div>
                  </div>
                  <div className="venue-schedule-content">
                    <div className="times-grid">
                      {selectedVenue.times.map((item, i) => (
                        <div key={i} className="time-item">
                          <div className="time-location">
                            <MapPin className="icon-sm text-primary-theme" />
                            <span className="time-location-text">{item.location.split('(')[0]}</span>
                          </div>
                          <span className="time-value">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="main-content-grid">
            <div className="pickup-section">
              {/* Pickup Locations & Maps Section */}
              <div>
                <h2 className="section-heading">
                  <MapPin className="icon-xl" /> PICKUP LOCATIONS & MAPS
                </h2>
                {settings.bus_pickup_locations && (
                  <div 
                    className="rich-text-content info-box"
                    dangerouslySetInnerHTML={{ __html: settings.bus_pickup_locations }} 
                  />
                )}
                <div className="vertical-stack-lg">
                  <div className="pickup-buttons">
                    {PICKUP_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedPickup(loc)}
                        className={`pickup-button ${selectedPickup.id === loc.id ? 'active' : ''}`}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                  
                  <motion.div 
                    key={selectedPickup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pickup-map-card"
                  >
                    <div className="pickup-map-header">
                      <div>
                        <h4 className="pickup-map-name">{selectedPickup.name}</h4>
                        <p className="pickup-map-address">{selectedPickup.address}</p>
                      </div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPickup.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="google-maps-link"
                      >
                        Open in Google Maps <ExternalLink className="icon-xxs" />
                      </a>
                    </div>
                    <div className="map-iframe-wrapper">
                      <iframe
                        src={selectedPickup.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map of ${selectedPickup.name}`}
                      ></iframe>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Travel Rules Section */}
              <div className="rules-section">
                <h2 className="section-heading">
                  <Info className="text-primary-theme icon-lg" /> Travel Rules & Details
                </h2>
                {settings.bus_travel_rules && (
                  <div 
                    className="rich-text-content info-box"
                    dangerouslySetInnerHTML={{ __html: settings.bus_travel_rules }} 
                  />
                )}
                <div className="vertical-stack-md">
                  {rules.map((rule, idx) => (
                    <div key={idx} className="rule-card">
                      <button 
                        onClick={() => setExpanded(expanded === idx ? null : idx)}
                        className="rule-header"
                      >
                        <span className="rule-title">{rule.title}</span>
                        <ChevronDown className={`icon-md transition-transform ${expanded === idx ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expanded === idx && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="rule-content"
                          >
                            <p>{rule.desc}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="help-sidebar">
                <h3 className="help-title">
                  <Phone className="icon-lg" /> Need Help?
                </h3>
                {settings.bus_help_text ? (
                  <div 
                    className="help-desc rich-text-content"
                    dangerouslySetInnerHTML={{ __html: settings.bus_help_text }} 
                  />
                ) : (
                  <p className="help-desc">Our team is available on concert nights to assist with any travel issues.</p>
                )}
                <div className="vertical-stack-md">
                    <div className="contact-card">
                      <User className="icon-md" />
                      <div>
                        <div className="contact-label">Anthony</div>
                        <a href="tel:+353879004876" className="contact-value">+353 (0) 87 900 4876</a>
                      </div>
                    </div>
                </div>

                <div className="policy-section">
                  <h3 className="policy-title">Onboard Policy</h3>
                  {settings.bus_policy_text ? (
                    <div 
                      className="rich-text-content policy-text"
                      dangerouslySetInnerHTML={{ __html: settings.bus_policy_text }} 
                    />
                  ) : (
                    <ul className="policy-list">
                      <li>• No alcohol permitted on board</li>
                      <li>• No smoking or vaping</li>
                      <li>• Small bags only (under seat storage)</li>
                      <li>• Respect your driver and fellow fans</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
