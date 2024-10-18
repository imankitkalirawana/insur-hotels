import { NextResponse } from 'next/server';
import Room from '@/models/Room';
import { connectDB } from '@/lib/db';

export async function GET(_request: Request, context: any) {
  try {
    await connectDB();
    const rooms = await Room.find({ hotelId: context.params.slug });
    if (!rooms) {
      return NextResponse.json({ message: 'rooms not found' }, { status: 404 });
    }
    return NextResponse.json(rooms);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
