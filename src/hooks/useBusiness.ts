import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  logo: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export function useBusiness() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBusiness();
    } else {
      setBusiness(null);
      setLoading(false);
    }
  }, [user]);

  const fetchBusiness = async () => {
    if (!user) return;

    try {
      // First get user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userProfile) return;

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', userProfile.id)
        .single();

      if (error) {
        console.error('Error fetching business:', error);
      } else {
        setBusiness(data);
        setNeedsSetup(!data.is_setup_complete);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (updates: Partial<Business>) => {
    if (!business) return { error: 'No business found' };

    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', business.id)
      .select()
      .single();

    if (!error && data) {
      setBusiness(data);
    }

    return { data, error };
  };

  return {
    business,
    loading,
    needsSetup,
    updateBusiness,
    refetch: fetchBusiness,
  };
}