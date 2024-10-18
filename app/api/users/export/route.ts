import { NextResponse } from 'next/server';
import User from '@/models/User';
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
    let users = await User.find().select('-password');
    users = users.filter((user) => user.email !== 'contact@divinely.dev');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 30 },
      { header: 'Role', key: 'role', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Created By', key: 'addedBy', width: 30 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
      { header: 'Updated By', key: 'modifiedBy', width: 30 }
    ];

    users.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: humanReadableDate(user.createdAt),
        addedBy: user.addedBy,
        updatedAt: humanReadableDate(user.updatedAt),
        modifiedBy: user.modifiedBy
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="users.xlsx"'
      }
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
