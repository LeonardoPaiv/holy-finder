import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ROUTES, COOKIES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { UserService } from '@/services/userService';

interface UserMetadata {
  cnpj: string;
  fullName: string;
  location?: { lat: number; lng: number };
}

export const useConfirmEmailViewModel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractTokensFromHash = (): { accessToken: string; refreshToken: string } | null => {
    if (typeof window === 'undefined') return null;
    
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) {
      return null;
    }

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken };
  };

  const saveTokensToCookies = (accessToken: string, refreshToken: string) => {
    Cookies.set(COOKIES.ACCESS_TOKEN, accessToken, { expires: 7 });
    Cookies.set(COOKIES.REFRESH_TOKEN, refreshToken, { expires: 7 });
  };

  const getUserMetadata = async (): Promise<UserMetadata | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.user_metadata) {
        return null;
      }

      return {
        cnpj: user.user_metadata.cnpj,
        fullName: user.user_metadata.fullName,
        location: user.user_metadata.location,
      };
    } catch (error) {
      console.error('Error getting user metadata:', error);
      return null;
    }
  };

  const createUserInMongoDB = async (email: string, metadata: UserMetadata): Promise<boolean> => {
    try {
      await UserService.confirmUser({
        email,
        fullName: metadata.fullName,
        institution: metadata.cnpj,
        location: metadata.location,
      });

      return true;
    } catch (error) {
      console.error('Error creating user in MongoDB:', error);
      throw error;
    }
  };

  const processConfirmation = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Extract tokens from hash
      const tokens = extractTokensFromHash();
      if (!tokens) {
        throw new Error('Tokens de confirmação não encontrados');
      }

      // 2. Save tokens to cookies
      saveTokensToCookies(tokens.accessToken, tokens.refreshToken);

      // 3. Get user metadata
      const metadata = await getUserMetadata();
      if (!metadata) {
        throw new Error('Metadados do usuário não encontrados');
      }

      // 4. Get user email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error('Email do usuário não encontrado');
      }

      // 5. Create user in MongoDB
      await createUserInMongoDB(user.email, metadata);

      // 6. Clear hash and redirect to dashboard
      router.replace(ROUTES.INSTITUTION.DASHBOARD);
    } catch (error: any) {
      console.error('Error processing confirmation:', error);
      setError(error.message || 'Erro ao processar confirmação');
      setLoading(false);
    }
  };

  useEffect(() => {
    processConfirmation();
  }, []);

  return {
    loading,
    error,
  };
};
