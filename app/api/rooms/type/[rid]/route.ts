import { NextResponse } from 'next/server';
import RoomType from '@/models/RoomType';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(_request: Request, context: any) {
  try {
    await connectDB();
    const roomType = await RoomType.findOne({ rid: context.params.rid });
    if (!roomType) {
      return NextResponse.json(
        { message: 'Room type not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(roomType);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export const PUT = auth(async function PUT(request: any, context: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    data.modifiedBy = request.auth.user.email;
    await connectDB();
    let roomType = await RoomType.findOne({ rid: context.params.rid });
    if (!roomType) {
      return NextResponse.json(
        { message: 'Room type not found' },
        { status: 404 }
      );
    }
    roomType = await RoomType.findOneAndUpdate(
      { rid: context.params.rid },
      data,
      {
        new: true
      }
    );
    if (!roomType) {
      return NextResponse.json(
        { message: 'Room type not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(roomType);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const roomType = await RoomType.findOneAndDelete({
      rid: context.params.rid
    });
    if (!roomType) {
      return NextResponse.json(
        { message: 'Room type not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Room type deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
