import { createClient } from '@supabase/supabase-js';
import Cookies from 'js-cookie';
import { COOKIES } from '@/lib/constants';

export const StorageService = {
  uploadCoverImage: async (file: File, cnpj: string): Promise<string> => {
    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!bucketName || !supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const token = Cookies.get(COOKIES.ACCESS_TOKEN);
    if (!token) {
      throw new Error('Authentication required');
    }

    // Create an authenticated client for this request
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const fileExt = file.name.split('.').pop();
    const fileName = `${cnpj}/cover/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrl;
  }
};
