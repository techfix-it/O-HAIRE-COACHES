export interface Venue {
  id: number;
  name: string;
  address?: string;
  city?: string;
}

export interface PickupLocation {
  id: number;
  name: string;
  description?: string;
}

export interface BusRoute {
  id: number;
  eventId: number;
  pickupLocationId: number;
  pickupLocation?: PickupLocation;
  departureTime: string;
  price: number;
  capacity: number;
  booked: number;
  pickup_name?: string; // Legacy support
  departure_time?: string; // Legacy support
}

export interface Event {
  id: number;
  title: string;
  date: string;
  venueId: number;
  venue?: Venue;
  description?: string;
  imageUrl?: string;
  image_url?: string; // Legacy support
  venue_name?: string; // Legacy support
  price: number;
  routes?: BusRoute[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
