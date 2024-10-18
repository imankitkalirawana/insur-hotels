import { NextResponse } from 'next/server';
import Room from '@/models/Room';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(_request: Request, context: any) {
  try {
    await connectDB();
    const rooms = await Room.findById(context.params.id);
    if (!rooms) {
      return NextResponse.json({ message: 'rooms not found' }, { status: 404 });
    }
    return NextResponse.json(rooms);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// update room

export const PUT = auth(async function PUT(request: any, context: any) {
  try {
    console.log('calling api');
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    data.modifiedBy = request.auth.user.email;
    await connectDB();
    let room = await Room.findById(context.params.id);
    if (!room) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    room = await Room.findByIdAndUpdate(context.params.id, data, {
      new: true
    });
    if (!room) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json(room);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// delete room by id

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const room = await Room.findByIdAndDelete(context.params.id);
    if (!room) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
