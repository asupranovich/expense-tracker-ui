import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Household } from '@/types';
import { householdService } from '../services/householdService';

export type HouseholdContextValue = {
  data: Household | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
};

const HouseholdContext = createContext<HouseholdContextValue | undefined>(undefined);

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Household | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await householdService.getHousehold();
      setData(result);
    } catch (e: any) {
      setError(e?.message || 'Failed to load household');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load on mount using cache if available
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<HouseholdContextValue>(() => ({
    data,
    loading,
    error,
    refresh: async () => load()
  }), [data, loading, error]);

  return (
    <HouseholdContext.Provider value={value}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold(): HouseholdContextValue {
  const ctx = useContext(HouseholdContext);
  if (!ctx) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return ctx;
}
