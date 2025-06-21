
import { supabase } from "@/integrations/supabase/client";

export interface PhotoData {
  id: string;
  phoneNumber: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
  contentType?: string;
  createdAt: string;
  expiresAt: string;
}

export const uploadPhoto = async (file: File, phoneNumber: string): Promise<PhotoData> => {
  try {
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${phoneNumber}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Insert photo metadata into database
    const { data, error } = await supabase
      .from('photos')
      .insert({
        phone_number: phoneNumber,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        content_type: file.type
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database insert failed: ${error.message}`);
    }

    return {
      id: data.id,
      phoneNumber: data.phone_number,
      fileName: data.file_name,
      filePath: data.file_path,
      fileSize: data.file_size,
      contentType: data.content_type,
      createdAt: data.created_at,
      expiresAt: data.expires_at
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const findPhotoByPhoneNumber = async (phoneNumber: string): Promise<PhotoData | null> => {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('phone_number', phoneNumber)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      phoneNumber: data.phone_number,
      fileName: data.file_name,
      filePath: data.file_path,
      fileSize: data.file_size,
      contentType: data.content_type,
      createdAt: data.created_at,
      expiresAt: data.expires_at
    };
  } catch (error) {
    console.error('Find photo error:', error);
    throw error;
  }
};

export const getPhotoUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('photos')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
