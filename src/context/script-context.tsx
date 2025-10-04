'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { ScriptBreakdownOutput } from '@/ai/flows/script-breakdown-flow';

interface ScriptContextType {
  script: string;
  setScript: (script: string) => void;
  breakdown: ScriptBreakdownOutput | null;
  setBreakdown: (breakdown: ScriptBreakdownOutput | null) => void;
  isLoading: boolean;
}

const ScriptContext = createContext<ScriptContextType>({
  script: '',
  setScript: () => {},
  breakdown: null,
  setBreakdown: () => {},
  isLoading: true,
});

export function useScript() {
  return useContext(ScriptContext);
}

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [script, setScriptState] = useState('');
  const [breakdown, setBreakdownState] = useState<ScriptBreakdownOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedScript = localStorage.getItem('cineflow-script');
      if (savedScript) {
        setScriptState(savedScript);
      }
      const savedBreakdown = localStorage.getItem('cineflow-breakdown');
      if (savedBreakdown) {
        setBreakdownState(JSON.parse(savedBreakdown));
      }
    } catch (error) {
      console.error('Failed to read from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setScript = useCallback((newScript: string) => {
    setScriptState(newScript);
    try {
      localStorage.setItem('cineflow-script', newScript);
      // When script changes, clear the old breakdown
      localStorage.removeItem('cineflow-breakdown');
      setBreakdownState(null);
    } catch (error) {
      console.error('Failed to save script to localStorage', error);
    }
  }, []);

  const setBreakdown = useCallback((newBreakdown: ScriptBreakdownOutput | null) => {
    setBreakdownState(newBreakdown);
    try {
      if (newBreakdown) {
        localStorage.setItem('cineflow-breakdown', JSON.stringify(newBreakdown));
      } else {
        localStorage.removeItem('cineflow-breakdown');
      }
    } catch (error) {
      console.error('Failed to save breakdown to localStorage', error);
    }
  }, []);

  const value = { script, setScript, breakdown, setBreakdown, isLoading };

  return (
    <ScriptContext.Provider value={value}>
      {children}
    </ScriptContext.Provider>
  );
}
