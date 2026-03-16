import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteSettings } from '@/lib/models/SiteSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ page_key: 'global' });
    
    // Convert to plain object and ensure background_image has a fallback
    const content = settings ? settings.toObject() : { background_image: '/background.png' };
    if (!content.background_image) {
      content.background_image = '/background.png';
    }
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching global settings:", error);
    // Return fallback content instead of 500 so clients degrade gracefully
    return NextResponse.json({ content: { background_image: '/background.png' } });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("PUT /api/component-settings/global - Body:", JSON.stringify(body).substring(0, 200) + "...");
    
    const { content } = body;
    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }
    
    // Remove MongoDB internal fields if they exist
    const { _id, __v, createdAt, updatedAt, page_key: bodyPageKey, ...updateData } = content;
    console.log("Updating global settings with:", Object.keys(updateData));

    const settings = await SiteSettings.findOneAndUpdate(
      { page_key: 'global' },
      { $set: { ...updateData, page_key: 'global' } },
      { new: true, upsert: true, runValidators: true, strict: false }
    );
    
    console.log("Successfully updated global settings document:", settings?._id);
    return NextResponse.json({ content: settings });
  } catch (error: any) {
    console.error("Error updating global settings:", error);
    return NextResponse.json({ 
      error: 'Failed to update global settings',
      details: error.message 
    }, { status: 500 });
  }
}
