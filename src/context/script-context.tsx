'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { ScriptBreakdownOutput } from '@/ai/flows/script-breakdown-flow';

export interface CrewMemberSalary {
  name: string;
  role: string;
  dailyRate: number;
  days: number;
}

const initialCrewAndCast: CrewMemberSalary[] = [
  { name: 'Priya Sharma', role: 'Lead Actor (Veera)', dailyRate: 50000, days: 25 },
  { name: 'Rohan Mehra', role: 'Lead Actor (Kabir)', dailyRate: 45000, days: 28 },
  { name: 'Anjali Patil', role: 'Supporting Actor', dailyRate: 18000, days: 20 },
  { name: 'Alex Ray', role: 'Director', dailyRate: 25000, days: 30 },
  { name: 'Sam Jones', role: 'Director of Photography', dailyRate: 20000, days: 30 },
  { name: 'Casey Smith', role: 'Production Designer', dailyRate: 15000, days: 35 },
  { name: 'Jordan Lee', role: 'Sound Mixer', dailyRate: 10000, days: 30 },
  { name: 'Taylor Kim', role: 'Editor', dailyRate: 12000, days: 45 },
];


interface ScriptContextType {
  script: string;
  setScript: (script: string) => void;
  breakdown: ScriptBreakdownOutput | null;
  setBreakdown: (breakdown: ScriptBreakdownOutput | null) => void;
  crewSalaries: CrewMemberSalary[];
  setCrewSalaries: (salaries: CrewMemberSalary[]) => void;
  isLoading: boolean;
}

const ScriptContext = createContext<ScriptContextType>({
  script: '',
  setScript: () => {},
  breakdown: null,
  setBreakdown: () => {},
  crewSalaries: [],
  setCrewSalaries: () => {},
  isLoading: true,
});

export function useScript() {
  return useContext(ScriptContext);
}

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [script, setScriptState] = useState('');
  const [breakdown, setBreakdownState] = useState<ScriptBreakdownOutput | null>(null);
  const [crewSalaries, setCrewSalariesState] = useState<CrewMemberSalary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedScript = localStorage.getItem('cineflow-script');
      if (savedScript) setScriptState(savedScript);
      
      const savedBreakdown = localStorage.getItem('cineflow-breakdown');
      if (savedBreakdown) setBreakdownState(JSON.parse(savedBreakdown));

      const savedSalaries = localStorage.getItem('cineflow-salaries');
      if (savedSalaries) {
        setCrewSalariesState(JSON.parse(savedSalaries));
      } else {
        setCrewSalariesState(initialCrewAndCast);
      }
    } catch (error) {
      console.error('Failed to read from localStorage', error);
      setCrewSalariesState(initialCrewAndCast);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setScript = useCallback((newScript: string) => {
    setScriptState(newScript);
    try {
      localStorage.setItem('cineflow-script', newScript);
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

  const setCrewSalaries = useCallback((newSalaries: CrewMemberSalary[]) => {
    setCrewSalariesState(newSalaries);
    try {
      localStorage.setItem('cineflow-salaries', JSON.stringify(newSalaries));
    } catch (error) {
      console.error('Failed to save salaries to localStorage', error);
    }
  }, []);

  const value = { script, setScript, breakdown, setBreakdown, crewSalaries, setCrewSalaries, isLoading };

  return (
    <ScriptContext.Provider value={value}>
      {children}
    </ScriptContext.Provider>
  );
}
