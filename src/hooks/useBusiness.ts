import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Business {
  id: string;
  name: string;
  owner_name: string;
  created_at: string;
}

export function useBusiness() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (user) {
      // Create a mock business from user data
      const mockBusiness: Business = {
        id: user.id,
        name: user.user_metadata?.business_name || 'My Business',
        owner_name: user.user_metadata?.full_name || 'Business Owner',
        created_at: user.created_at || new Date().toISOString()
      };
      
      setBusiness(mockBusiness);
      setNeedsSetup(false);
      setLoading(false);
    } else {
      setBusiness(null);
      setNeedsSetup(false);
      setLoading(false);
    }
  }, [user]);

  const updateBusiness = async (updates: Partial<Business>) => {
    if (business) {
      setBusiness({ ...business, ...updates });
    }
    return { data: business, error: null };
  };

  return {
    business,
    loading,
    needsSetup,
    updateBusiness,
    refetch: () => {},
  };
}