import { NextResponse } from 'next/server';
import Hotel from '@/models/Hotel';
import { connectDB } from '@/lib/db';

// get hotel with slug

export async function GET(_request: Request, context: any) {
  try {
    await connectDB();
    const hotel = await Hotel.findOne({ slug: context.params.slug });
    if (!hotel) {
      return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    }
    return NextResponse.json(hotel);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
