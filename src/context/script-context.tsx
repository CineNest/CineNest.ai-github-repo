'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { ScriptBreakdownOutput } from '@/ai/flows/script-breakdown-flow';

export interface CrewMemberSalary {
  name: string;
  role: string;
  dailyRate: number;
  days: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
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

const initialTransactions: Transaction[] = [
    {id: 'TXN001', date: '2024-07-28', description: 'Camera Package Rental', amount: -25000, category: 'Equipment'},
    {id: 'TXN002', date: '2024-07-28', description: 'Art Department Supplies', amount: -4500, category: 'Props'},
    {id: 'TXN003', date: '2024-07-27', description: 'Location Fee: Downtown Loft', amount: -12000, category: 'Locations'},
    {id: 'TXN004', date: '2024-07-26', description: 'Catering: Day 1', amount: -8000, category: 'Misc'},
];

interface ScriptContextType {
  script: string;
  setScript: (script: string) => void;
  breakdown: ScriptBreakdownOutput | null;
  setBreakdown: (breakdown: ScriptBreakdownOutput | null) => void;
  crewSalaries: CrewMemberSalary[];
  setCrewSalaries: (salaries: CrewMemberSalary[]) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  isLoading: boolean;
}

const ScriptContext = createContext<ScriptContextType>({
  script: '',
  setScript: () => {},
  breakdown: null,
  setBreakdown: () => {},
  crewSalaries: [],
  setCrewSalaries: () => {},
  transactions: [],
  setTransactions: () => {},
  addTransaction: () => {},
  isLoading: true,
});

export function useScript() {
  return useContext(ScriptContext);
}

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [script, setScriptState] = useState('');
  const [breakdown, setBreakdownState] = useState<ScriptBreakdownOutput | null>(null);
  const [crewSalaries, setCrewSalariesState] = useState<CrewMemberSalary[]>([]);
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
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

      const savedTransactions = localStorage.getItem('cineflow-transactions');
       if (savedTransactions) {
        setTransactionsState(JSON.parse(savedTransactions));
      } else {
        setTransactionsState(initialTransactions);
      }

    } catch (error) {
      console.error('Failed to read from localStorage', error);
      setCrewSalariesState(initialCrewAndCast);
      setTransactionsState(initialTransactions);
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
  
  const setTransactions = useCallback((newTransactions: Transaction[]) => {
    setTransactionsState(newTransactions);
    try {
        localStorage.setItem('cineflow-transactions', JSON.stringify(newTransactions));
    } catch (error) {
        console.error('Failed to save transactions to localStorage', error);
    }
  }, []);

  const addTransaction = useCallback((newTransactionData: Omit<Transaction, 'id'>) => {
    setTransactionsState(prev => {
        const newTransaction: Transaction = {
            ...newTransactionData,
            id: `TXN${(Date.now() + Math.random()).toString(36)}`,
        };
        const updatedTransactions = [newTransaction, ...prev];
        try {
            localStorage.setItem('cineflow-transactions', JSON.stringify(updatedTransactions));
        } catch (error) {
            console.error('Failed to save transactions to localStorage', error);
        }
        return updatedTransactions;
    });
  }, []);

  const value = { script, setScript, breakdown, setBreakdown, crewSalaries, setCrewSalaries, transactions, setTransactions, addTransaction, isLoading };

  return (
    <ScriptContext.Provider value={value}>
      {children}
    </ScriptContext.Provider>
  );
}
