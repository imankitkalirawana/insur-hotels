import { NextResponse } from 'next/server';
import Room from '@/models/Room';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find();
    return NextResponse.json(rooms);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// create new rooms
export const POST = auth(async function POST(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    data.addedBy = request.auth.user.email;
    data.modifiedBy = request.auth.user.email;
    if (!data.title) {
      return NextResponse.json(
        { message: 'Please enter room title' },
        { status: 400 }
      );
    }
    const room = new Room(data);
    await connectDB();
    await room.save();
    return NextResponse.json({ room, message: 'Room created successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
