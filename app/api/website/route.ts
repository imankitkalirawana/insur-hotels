import { NextResponse } from 'next/server';
import Website from '@/models/Website';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET() {
  try {
    await connectDB();
    const website = await Website.findOne();
    return NextResponse.json(website);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// create new website
export const POST = auth(async function POST(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    data.addedBy = request.auth.user.email;
    data.modifiedBy = request.auth.user.email;
    if (!data.name) {
      return NextResponse.json(
        { message: 'Please enter website name' },
        { status: 400 }
      );
    }
    const website = new Website(data);
    await connectDB();
    await website.save();
    return NextResponse.json({
      website,
      message: 'Website created successfully'
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// update website
export const PUT = auth(async function PUT(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    data.modifiedBy = request.auth.user.email;
    await connectDB();
    let website = await Website.findOne();
    if (!website) {
      return NextResponse.json(
        { message: 'Website not found' },
        { status: 404 }
      );
    }
    await Website.updateOne({}, data);
    return NextResponse.json({
      website,
      message: 'Website updated successfully'
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
