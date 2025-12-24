import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { ROUTES, COOKIES } from '@/lib/constants';
import { translateSupabaseError } from '@/lib/supabaseErrors';
import { UserService } from '@/services/userService';
import { CompanyService } from '@/services/companyService';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [institution, setInstitution] = useState<any>(null);



  const fetchingRef = useRef(false);

  const fetchUserData = async (email: string) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    try {
      // Fetch User using service
      setLoading(true);
      const userProfile = await UserService.getUserByEmail(email);
      
      if (userProfile) {
        setUser(userProfile);
        if (userProfile.institution) {
          // Fetch Company using service
          try {
            const company = await CompanyService.getCompanyByCnpj(userProfile.institution);
            setInstitution(company);
          } catch (error) {
            console.error('Error fetching company:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        if (session.user.email && !user) {
             fetchUserData(session.user.email);
        }
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (session.user.email && !user) {
            fetchUserData(session.user.email);
        }
      } else {
        setUser(null);
        setInstitution(null);
      }
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
        if (data.session.user.email) {
            await fetchUserData(data.session.user.email);
        }
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

  const signUp = async (email: string, password: string, cnpj: string, fullName: string, location?: { lat: number; lng: number } | null): Promise<void> => {
    setLoading(true);
    try {
      // 1. Create user in Supabase with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            cnpj,
            fullName,
            location,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.INSTITUTION.CONFIRM}`,
        },
      });

      if (error) throw error;

      // User will be created in MongoDB after email confirmation
      
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
      setUser(null);
      setInstitution(null);
      router.push(ROUTES.INSTITUTION.LOGIN);
    } catch (error) {
      console.error('Error logging out:', error);
      // Force redirect even if error
      router.push(ROUTES.INSTITUTION.LOGIN);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async (callback?: () => void): Promise<void> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session && !error) {
        if (session.user.email) {
            await fetchUserData(session.user.email);
        }
        callback?.();
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
          if (data.session.user.email) {
            await fetchUserData(data.session.user.email);
          }
          callback?.();
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
    institution,
    setInstitution,
    setUser,
    loading,
    signIn,
    signUp,
    signOut,
    checkSession,
  };
};
