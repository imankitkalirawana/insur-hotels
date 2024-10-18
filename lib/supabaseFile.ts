import { toast } from 'sonner';
import { supabase } from './supabaseClient';

export async function uploadFile(
  file: File,
  filename?: string,
  basket?: string
) {
  try {
    const { data, error } = await supabase.storage
      .from(basket || 'hotel-booking')
      .upload(filename || file.name, file, {
        upsert: true,
        cacheControl: '1'
      });
    if (error) {
      console.log(error);
      toast.error('Error uploading file');
      throw new Error('Error uploading file');
    } else {
      return await retrievePublicUrl(filename || file.name, basket);
    }
  } catch (error) {
    console.error(error);
    toast.error('An error occurred while uploading file');
    throw new Error('An error occurred while uploading file');
  }
}

export async function retrievePublicUrl(filename: string, basket?: string) {
  try {
    const { data } = supabase.storage
      .from(basket || 'hotel-booking')
      .getPublicUrl(filename);
    if (data) {
      return data.publicUrl;
    } else {
      toast.error('Error retrieving public URL');
      return null;
    }
  } catch (error) {
    console.error(error);
    toast.error('An error occurred while retrieving public URL');
    return error;
  }
}

export async function deleteFile(filename: string | string[], basket?: string) {
  try {
    const { data, error } = await supabase.storage
      .from(basket || 'hotel-booking')
      // .remove();
      // if filename is string then use remove([filename]) if filename is string[] then use remove(filename)
      .remove(typeof filename === 'string' ? [filename] : filename);
    if (error) {
      console.log(error);
      toast.error('Error deleting file');
      throw new Error('Error deleting file');
    } else {
      console.log('deleted');
      return data;
    }
  } catch (error) {
    console.error(error);
    toast.error('An error occurred while deleting file');
    return error;
  }
}

export async function listAllFiles(folder: string, basket?: string) {
  const { data, error } = await supabase.storage
    .from(basket || 'avatars')
    .list(folder || 'folder', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });
  if (error) {
    console.log(error);
    toast.error('Error listing files');
    throw new Error('Error listing files');
  } else {
    return data;
  }
}
