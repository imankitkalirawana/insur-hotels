import { NextResponse } from 'next/server';
import Newsletter from '@/models/Newsletter';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';
import ExcelJS from 'exceljs';
import { humanReadableDate } from '@/functions/utility';

export const GET = auth(async function GET(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const newsletters = await Newsletter.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Newsletters');
    worksheet.columns = [
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Date', key: 'createdAt', width: 20 }
    ];

    newsletters.forEach((newsletter) => {
      worksheet.addRow({
        email: newsletter.email,
        createdAt: humanReadableDate(newsletter.createdAt)
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="newsletters.xlsx"'
      }
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});