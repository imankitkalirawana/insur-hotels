import { NextResponse } from 'next/server';
import Hotel from '@/models/Hotel';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET() {
  try {
    await connectDB();
    const hotels = await Hotel.find();
    return NextResponse.json(hotels);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// create new hotel
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
        { message: 'Please enter hotel name' },
        { status: 400 }
      );
    }
    const hotel = new Hotel(data);
    await connectDB();
    await hotel.save();
    return NextResponse.json({ hotel, message: 'Hotel created successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
