import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  page_key: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  background_image?: string;
  button_text?: string;
  button_link?: string;
  // Component settings
  logo_text?: string;
  logo_accent?: string;
  // Contact page
  phone?: string;
  email?: string;
  address?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
  // About page
  story_title?: string;
  story_subtitle?: string;
  card1_icon?: string;
  card1_title?: string;
  card1_text?: string;
  card2_icon?: string;
  card2_title?: string;
  card2_text?: string;
  card3_icon?: string;
  card3_title?: string;
  card3_text?: string;
  // About page: The O'Haire Difference section
  diff_title?: string;
  diff_text1?: string;
  diff_text2?: string;
  diff_image?: string;
  // About page: Stats
  stat1_value?: string;
  stat1_label?: string;
  stat2_value?: string;
  stat2_label?: string;
  stat3_value?: string;
  stat3_label?: string;
  // Bus info page
  bus_pickup_locations?: string;
  bus_travel_rules?: string;
  bus_venue_departure?: string;
  bus_help_text?: string;
  bus_policy_text?: string;
}

const siteSettingsSchema = new Schema(
  {
    page_key: { type: String, required: true, unique: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    image_url: { type: String, default: '' },
    background_image: { type: String, default: '' },
    button_text: { type: String, default: '' },
    button_link: { type: String, default: '' },
    logo_text: { type: String, default: "O'HAIRE" },
    logo_accent: { type: String, default: "COACHES" },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    social_facebook: { type: String, default: '' },
    social_instagram: { type: String, default: '' },
    social_twitter: { type: String, default: '' },
    story_title: { type: String, default: "OUR STORY" },
    story_subtitle: { type: String, default: "Serving Ireland's concert fans for over two decades with reliability and passion." },
    card1_icon: { type: String, default: 'Bus' },
    card1_title: { type: String, default: 'Founded in 2004' },
    card1_text: { type: String, default: "O'Haire Concert Coaches started with a single bus and a dream to make concert travel stress-free for music lovers in the west of Ireland." },
    card2_icon: { type: String, default: 'Shield' },
    card2_title: { type: String, default: 'Guaranteed Return' },
    card2_text: { type: String, default: "We've never left a fan behind. Our coaches wait until the final encore and depart only when every passenger is accounted for." },
    card3_icon: { type: String, default: 'Clock' },
    card3_title: { type: String, default: 'Punctuality First' },
    card3_text: { type: String, default: "We know how important the support act is. We arrive at venues with plenty of time for you to soak in the atmosphere." },
    // Difference section defaults
    diff_title: { type: String, default: "The O'Haire Difference" },
    diff_text1: { type: String, default: "Our fleet consists of modern, executive coaches equipped with comfortable seating, climate control, and experienced drivers who know Ireland's road networks better than anyone." },
    diff_text2: { type: String, default: "Whether it's a small gig in the 3Arena or a massive festival in Marlay Park, we bring the same level of commitment and professionalism to every trip." },
    diff_image: { type: String, default: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800" },
    // Stats defaults
    stat1_value: { type: String, default: "20k+" },
    stat1_label: { type: String, default: "Happy Fans Yearly" },
    stat2_value: { type: String, default: "500+" },
    stat2_label: { type: String, default: "Shows Covered" },
    stat3_value: { type: String, default: "100%" },
    stat3_label: { type: String, default: "Irish Owned" },
    // Bus info defaults
    bus_pickup_locations: { type: String, default: 'Pickup locations and details will be shared here.' },
    bus_travel_rules: { type: String, default: 'Travel rules and details go here.' },
    bus_venue_departure: { type: String, default: 'Venue departure times will be specified per event.' },
    bus_help_text: { type: String, default: 'Our team is available on concert nights to assist with any travel issues. Anthony' },
    bus_policy_text: { type: String, default: '• No alcohol permitted on board\n• No smoking or vaping\n• Small bags only (under seat storage)\n• Respect your driver and fellow fans\n+353 (0) 87 900 4876' },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);
