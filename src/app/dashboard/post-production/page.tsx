'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, BarChart, Users, Video } from 'lucide-react';
import Link from 'next/link';

export default function PostProductionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Post-Production Dashboard</h1>
        <p className="text-muted-foreground">
          Track budgets, monitor distribution, and keep investors updated.
        </p>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Tracking</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Monitor post-production expenses against your budget.
            </p>
            <Link href="/dashboard/production">
              <Button>View Budget</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribution</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Track distribution deals, revenue, and performance.
            </p>
            <Link href="/dashboard/business">
              <Button>Distribution Details</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
