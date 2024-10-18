import { NextResponse } from 'next/server';
import Hotel from '@/models/Hotel';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(_request: Request, context: any) {
  try {
    await connectDB();
    const hotel = await Hotel.findById(context.params.id);
    if (!hotel) {
      return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    }
    return NextResponse.json(hotel);
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
    let hotel = await Hotel.findById(context.params.id);
    if (!hotel) {
      return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    }
    hotel = await Hotel.findByIdAndUpdate(context.params.id, data, {
      new: true
    });
    if (!hotel) {
      return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    }
    return NextResponse.json(hotel);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// delete hotel by id
export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    // if (request.auth?.user?.role!== 'admin') {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }
    await connectDB();
    const hotel = await Hotel.findByIdAndDelete(context.params.id);
    if (!hotel) {
      return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Hotel deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
