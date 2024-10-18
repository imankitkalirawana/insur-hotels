import { NextResponse } from 'next/server';
import RoomType from '@/models/RoomType';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET() {
  try {
    await connectDB();
    const roomTypes = await RoomType.find();
    return NextResponse.json(roomTypes);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// create new room type

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
        { message: 'Please enter room type name' },
        { status: 400 }
      );
    }
    const roomType = new RoomType(data);
    await connectDB();
    await roomType.save();
    return NextResponse.json({
      roomType,
      message: 'Room type created successfully'
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
