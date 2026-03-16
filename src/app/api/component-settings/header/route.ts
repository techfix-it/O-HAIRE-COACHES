import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteSettings } from '@/lib/models/SiteSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ page_key: 'header' });
    
    return NextResponse.json({ 
      content: settings || {
        logo_text: "O'HAIRE",
        logo_accent: "COACHES",
        nav_links: [
          { id: 1, text: 'Home', link: '/' },
          { id: 2, text: 'Concerts', link: '/concerts' },
          { id: 3, text: 'Pickup Info', link: '/bus-info' },
          { id: 4, text: 'About', link: '/about' },
          { id: 5, text: 'Contact', link: '/contact' }
        ]
      }
    });
  } catch (error) {
    console.error("Error fetching header settings:", error);
    return NextResponse.json({ content: {
      logo_text: "O'HAIRE",
      logo_accent: "COACHES",
      nav_links: [
        { id: 1, text: 'Home', link: '/' },
        { id: 2, text: 'Concerts', link: '/concerts' },
        { id: 3, text: 'Pickup Info', link: '/bus-info' },
        { id: 4, text: 'About', link: '/about' },
        { id: 5, text: 'Contact', link: '/contact' }
      ]
    }});
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { content } = body;
    
    const { _id, __v, createdAt, updatedAt, ...updateData } = content || {};

    const settings = await SiteSettings.findOneAndUpdate(
      { page_key: 'header' },
      { $set: { ...updateData, page_key: 'header' } },
      { new: true, upsert: true, runValidators: true, strict: false }
    );
    
    return NextResponse.json({ content: settings });
  } catch (error) {
    console.error("Error updating header settings:", error);
    return NextResponse.json({ error: 'Failed to update header settings' }, { status: 500 });
  }
}
