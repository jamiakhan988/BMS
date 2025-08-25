import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (!error && data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, businessName: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            {
              auth_user_id: authData.user.id,
              full_name: fullName,
              email: email,
              is_business_owner: true,
            }
          ])
          .select()
          .single();

        if (userError) throw userError;

        if (userData) {
          // Create business record
          const { error: businessError } = await supabase
            .from('businesses')
            .insert([
              {
                owner_id: userData.id,
                name: businessName,
                is_setup_complete: false,
              }
            ]);

          if (businessError) throw businessError;
        }
      }

      return { data: authData, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      return { data, error };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setUserProfile(null);
    }
    return { error };
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
  };

  const completeBusinessSetup = async (businessData: any) => {
    if (!userProfile) return { error: 'No user profile found' };

    try {
      const { data, error } = await supabase
        .from('businesses')
        .update({
          ...businessData,
          is_setup_complete: true,
        })
        .eq('owner_id', userProfile.id)
        .select()
        .single();

      return { data, error };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  return {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    completeBusinessSetup,
  };
}