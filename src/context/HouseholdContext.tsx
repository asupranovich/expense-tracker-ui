import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Household } from '@/types';
import { householdService } from '../services/householdService';

export type HouseholdContextValue = {
  data: Household | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const HouseholdContext = createContext<HouseholdContextValue | undefined>(undefined);

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Household | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const load = async () => {
    try {
      setLoading(true);
      const result = await householdService.getHousehold();
      setData(result);
    } catch (e: any) {
      alert(e?.message || 'Failed to load household');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const value = useMemo<HouseholdContextValue>(() => ({
    data,
    loading,
    refresh: async () => load()
  }), [data, loading]);

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
