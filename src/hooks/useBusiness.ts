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
  website: string | null;
  tax_number: string | null;
  currency: string;
  timezone: string;
  is_setup_complete: boolean;
  created_at: string;
  updated_at: string;
}

export function useBusiness() {
  const { user, userProfile } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (userProfile) {
      fetchBusiness();
    } else if (user && !userProfile) {
      // Wait for user profile to load
      setLoading(true);
    } else {
      setBusiness(null);
      setLoading(false);
    }
  }, [user, userProfile]);

  const fetchBusiness = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', userProfile.id)
        .single();

      if (error) {
        console.error('Error fetching business:', error);
        setNeedsSetup(true);
      } else if (data) {
        setBusiness(data);
        setNeedsSetup(!data.is_setup_complete);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      setNeedsSetup(true);
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (updates: Partial<Business>) => {
    if (!business) return { error: 'No business found' };

    try {
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
    } catch (error: any) {
      return { data: null, error };
    }
  };

  return {
    business,
    loading,
    needsSetup,
    updateBusiness,
    refetch: fetchBusiness,
  };
}