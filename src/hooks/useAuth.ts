import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

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
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (!authError && authData.user) {
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

      if (!userError && userData) {
        // Create business record
        await supabase
          .from('businesses')
          .insert([
            {
              owner_id: userData.id,
              name: businessName,
              is_setup_complete: false,
            }
          ]);
      }

      return { data: authData, error: userError };
    }

    return { data: authData, error: authError };
  };

  const completeBusinessSetup = async (businessData: any) => {
    if (!userProfile) return { error: 'No user profile found' };

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
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
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