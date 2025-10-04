'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useScript, type CrewMemberSalary } from '@/context/script-context';

export default function CrewSalaryPage() {
  const { crewSalaries, setCrewSalaries } = useScript();
  const [localSalaries, setLocalSalaries] = useState<CrewMemberSalary[]>(crewSalaries);

  useEffect(() => {
    setLocalSalaries(crewSalaries);
  }, [crewSalaries]);

  const handleInputChange = (index: number, field: keyof CrewMemberSalary, value: string) => {
    const newSalaries = [...localSalaries];
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      (newSalaries[index] as any)[field] = numericValue;
      setLocalSalaries(newSalaries);
      setCrewSalaries(newSalaries); // Update the context
    } else if (value === '') {
      (newSalaries[index] as any)[field] = 0;
      setLocalSalaries(newSalaries);
      setCrewSalaries(newSalaries);
    }
  };
  
  const calculateTotal = (rate: number, days: number) => rate * days;

  const totalCrewCost = localSalaries.reduce((acc, member) => acc + calculateTotal(member.dailyRate, member.days), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cast & Crew Salary Management</h1>
        <p className="text-muted-foreground">
          Enter and track the payment details for each cast and crew member.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personnel Payment Details</CardTitle>
          <CardDescription>
            Input the daily rate and number of work days for each person. All figures in INR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[150px]">Daily Rate (₹)</TableHead>
                  <TableHead className="w-[100px]">Days</TableHead>
                  <TableHead className="text-right w-[180px]">Total Payment (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localSalaries.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={member.dailyRate}
                        onChange={(e) => handleInputChange(index, 'dailyRate', e.target.value)}
                        className="font-mono"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={member.days}
                        onChange={(e) => handleInputChange(index, 'days', e.target.value)}
                        className="font-mono"
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {calculateTotal(member.dailyRate, member.days).toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 pt-4 border-t text-right">
            <h3 className="text-lg font-bold">
              Total Personnel Cost: {totalCrewCost.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              })}
            </h3>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Link href="/dashboard/production">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Budget Tracking
          </Button>
        </Link>
      </div>
    </div>
  );
}
