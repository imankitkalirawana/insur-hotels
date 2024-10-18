import { NextResponse } from 'next/server';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { auth } from '@/auth';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

async function uploadFileToS3(buffer: Buffer, filename: any, contentType: any) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: contentType
  };
  const deleteParams = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: filename
  };
  await s3Client.send(new DeleteObjectCommand(deleteParams));
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return filename;
}

async function deleteFileFromS3(filename: any) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: filename
  };
  await s3Client.send(new DeleteObjectCommand(params));
}

export const POST = auth(async function POST(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.formData();
    const file = data.get('file');
    const filename = data.get('filename');
    if (!file) {
      return NextResponse.json(
        { message: 'Please select a file' },
        { status: 400 }
      );
    }
    const contentType = file.type;
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(
      buffer,
      filename || file.name,
      contentType
    );
    return NextResponse.json({
      url: `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName || file.name}`,
      message: 'File uploaded successfully'
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    const filename = data.filename;
    if (!filename) {
      return NextResponse.json(
        { message: 'Please provide filename' },
        { status: 400 }
      );
    }
    await deleteFileFromS3(filename);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
