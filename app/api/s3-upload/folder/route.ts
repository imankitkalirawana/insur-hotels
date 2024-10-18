import { NextResponse } from 'next/server';
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3';
import { auth } from '@/auth';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

async function deleteFolderFromS3(folderPath: string) {
  try {
    // Step 1: List all objects within the folder (prefix)
    const listParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Prefix: folderPath // Prefix represents the folder path in S3
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const listResponse = await s3Client.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log('Folder is already empty or does not exist');
      return;
    }

    // Step 2: Prepare list of objects to delete
    const deleteParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Delete: {
        Objects: listResponse.Contents.map((object) => ({ Key: object.Key }))
      }
    };

    // Step 3: Delete the objects
    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3Client.send(deleteCommand);

    console.log(`Folder ${folderPath} and its contents deleted successfully`);
  } catch (error) {
    console.error('Error deleting folder from S3:', error);
  }
}

export const DELETE = auth(async function DELETE(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { folderPath } = await request.json();
    if (!folderPath) {
      return NextResponse.json(
        { message: 'Please provide folder path' },
        { status: 400 }
      );
    }
    await deleteFolderFromS3(folderPath);
    return NextResponse.json({
      message: `Folder ${folderPath} deleted successfully`
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
