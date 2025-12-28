import { supabase } from '@/lib/supabase';
import { translateSupabaseError } from '@/lib/supabaseErrors';

export const AuthService = {
  /**
   * Solicita reset de senha via email
   * @param email Email do usuário
   * @returns Promise<void>
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      });

      if (error) throw error;
    } catch (error: any) {
      if (error.code) {
        throw new Error(translateSupabaseError(error.code));
      }
      throw error;
    }
  },

  /**
   * Atualiza a senha do usuário autenticado
   * @param newPassword Nova senha
   * @returns Promise<void>
   */
  updatePassword: async (newPassword: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error: any) {
      if (error.code) {
        throw new Error(translateSupabaseError(error.code));
      }
      throw error;
    }
  },
};
