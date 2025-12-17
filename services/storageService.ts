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
  },

  deleteCoverImage: async (url: string): Promise<void> => {
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

    // Extract path from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const path = url.split(`${bucketName}/`).pop();
    
    if (!path) {
      console.error('Could not extract path from URL:', url);
      return;
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      throw error;
    }
  },

  uploadPostImage: async (file: File, cnpj: string): Promise<{ url: string; path: string }> => {
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
    const fileName = `${cnpj}/post/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return { url: publicUrl, path: fileName };
  },

  deletePostImage: async (url: string): Promise<void> => {
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

    // Extract path from URL
    const path = url.split(`${bucketName}/`).pop();
    
    if (!path) {
      console.error('Could not extract path from URL:', url);
      return;
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      throw error;
    }
  },

  validateImageFile: (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed'
      };
    }

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    return { valid: true };
  }
};
