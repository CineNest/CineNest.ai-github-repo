'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface ScriptContextType {
  script: string;
  setScript: (script: string) => void;
  isLoading: boolean;
}

const ScriptContext = createContext<ScriptContextType>({
  script: '',
  setScript: () => {},
  isLoading: true,
});

export function useScript() {
  return useContext(ScriptContext);
}

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [script, setScriptState] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedScript = localStorage.getItem('cineflow-script');
      if (savedScript) {
        setScriptState(savedScript);
      }
    } catch (error) {
      console.error('Failed to read script from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setScript = useCallback((newScript: string) => {
    setScriptState(newScript);
    try {
      localStorage.setItem('cineflow-script', newScript);
    } catch (error) {
      console.error('Failed to save script to localStorage', error);
    }
  }, []);

  const value = { script, setScript, isLoading };

  return (
    <ScriptContext.Provider value={value}>
      {children}
    </ScriptContext.Provider>
  );
}
