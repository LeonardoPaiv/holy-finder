import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { ROUTES, COOKIES } from '@/lib/constants';
import { translateSupabaseError } from '@/lib/supabaseErrors';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        Cookies.set(COOKIES.ACCESS_TOKEN, data.session.access_token, { expires: 7 });
        Cookies.set(COOKIES.REFRESH_TOKEN, data.session.refresh_token, { expires: 7 });
      }
      
      return Promise.resolve();
    } catch (error: any) {
      if (error.code) {
        throw new Error(translateSupabaseError(error.code))
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, cnpj: string): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            cnpj,
          },
          emailRedirectTo: `${window.location.origin}${ROUTES.INSTITUTION.DASHBOARD}`,
        },
      });

      if (error) throw error;
      
      return Promise.resolve();
    } catch (error: any) {
      if (error.code) {
        throw new Error(translateSupabaseError(error.code))
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      Cookies.remove(COOKIES.ACCESS_TOKEN);
      Cookies.remove(COOKIES.REFRESH_TOKEN);
      router.push(ROUTES.INSTITUTION.LOGIN);
    } catch (error) {
      console.error('Error logging out:', error);
      // Force redirect even if error
      router.push(ROUTES.INSTITUTION.LOGIN);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async (callback: () => void): Promise<void> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session && !error) {
        callback();
        return;
      }

      const refreshToken = Cookies.get(COOKIES.REFRESH_TOKEN);

      if (refreshToken) {
        const { data, error: refreshError } = await supabase.auth.refreshSession({ 
          refresh_token: refreshToken 
        });

        if (data.session && !refreshError) {
          Cookies.set(COOKIES.ACCESS_TOKEN, data.session.access_token, { expires: 7 });
          Cookies.set(COOKIES.REFRESH_TOKEN, data.session.refresh_token, { expires: 7 });
          callback();
          return;
        }
      }

      // If we get here, session is invalid and refresh failed/didn't exist
      Cookies.remove(COOKIES.ACCESS_TOKEN);
      Cookies.remove(COOKIES.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error checking session:', error);
      Cookies.remove(COOKIES.ACCESS_TOKEN);
      Cookies.remove(COOKIES.REFRESH_TOKEN);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    checkSession,
  };
};
