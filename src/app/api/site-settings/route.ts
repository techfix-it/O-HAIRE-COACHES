import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteSettings } from '@/lib/models/SiteSettings';

const PAGE_DEFAULTS: Record<string, object> = {
  home: {
    title: "GET THERE WITH O'HAIRE",
    description: "Premium return coach services to Ireland's biggest concerts and festivals.",
    image_url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1920",
    button_text: "Browse Concerts",
    button_link: "/concerts"
  },
  concerts: {
    title: "UPCOMING CONCERTS",
    subtitle: "Book your coach to the biggest shows in Ireland."
  },
  bus_info: {
    title: "PICKUP POINTS & TIMES",
    subtitle: "Find your nearest pickup location and check estimated departure times."
  },
  about: { title: "ABOUT O'HAIRE", subtitle: "", description: "" },
  contact: { title: "CONTACT US", subtitle: "", description: "" }
};

// GET /api/site-settings
export async function GET() {
  try {
    await connectDB();
    const pages = ['home', 'concerts', 'bus_info', 'about', 'contact'];

    for (const page of pages) {
      await SiteSettings.findOneAndUpdate(
        { page_key: page },
        { $setOnInsert: { page_key: page, ...PAGE_DEFAULTS[page] } },
        { upsert: true, new: true }
      );
    }

    const settings = await SiteSettings.find({ page_key: { $in: pages } });
    return NextResponse.json(settings);
  } catch {
    // Return defaults so pages render even when DB is unreachable
    const fallback = Object.entries(PAGE_DEFAULTS).map(([page_key, data]) => ({ page_key, ...data }));
    return NextResponse.json(fallback);
  }
}
