import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteSettings } from '@/lib/models/SiteSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ page_key: 'footer' });
    
    return NextResponse.json({ 
      content: settings || {
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
      }
    });
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    return NextResponse.json({ error: 'Failed to fetch footer settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { content } = body;
    
    const { _id, __v, createdAt, updatedAt, ...updateData } = content || {};

    const settings = await SiteSettings.findOneAndUpdate(
      { page_key: 'footer' },
      { $set: { ...updateData, page_key: 'footer' } },
      { new: true, upsert: true, runValidators: true, strict: false }
    );
    
    return NextResponse.json({ content: settings });
  } catch (error) {
    console.error("Error updating footer settings:", error);
    return NextResponse.json({ error: 'Failed to update footer settings' }, { status: 500 });
  }
}
