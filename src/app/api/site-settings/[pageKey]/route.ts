import { NextRequest, NextResponse } from 'next/server';
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

type Params = { params: Promise<{ pageKey: string }> };

// GET /api/site-settings/:pageKey
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { pageKey } = await params;
    await connectDB();
    let settings = await SiteSettings.findOne({ page_key: pageKey });

    if (!settings) {
      settings = await SiteSettings.create({
        page_key: pageKey,
        ...(PAGE_DEFAULTS[pageKey] || {})
      });
    }

    return NextResponse.json(settings);
  } catch {
    const { pageKey } = await params;
    return NextResponse.json({ page_key: pageKey, ...(PAGE_DEFAULTS[pageKey] || {}) });
  }
}

// PUT /api/site-settings/:pageKey
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { pageKey } = await params;
    await connectDB();
    const body = await req.json();
    // Strip read-only fields
    const { _id, __v, createdAt, updatedAt, page_key, ...data } = body;

    const settings = await SiteSettings.findOneAndUpdate(
      { page_key: pageKey },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Erro ao actualizar page settings' }, { status: 400 });
  }
}
