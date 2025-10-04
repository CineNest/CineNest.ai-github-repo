'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentationDialog } from '@/components/app/doc-link-button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const documentationSections = [
  {
    title: 'Plan',
    description: 'Production plan and schedule.',
    fields: ['Shooting_Days', 'Locations', 'Weather', 'Equipment_List'],
    sheetGid: '0',
  },
  {
    title: 'Crew',
    description: 'Crew information and costs.',
    fields: ['Role', 'Daily_Rate', 'Days', 'Total_Cost'],
    sheetGid: '1583953493',
  },
  {
    title: 'Budget',
    description: 'Overall project budget breakdown.',
    fields: ['Total_Budget', 'Base_Cost', 'Crew_Cost', 'Equipment_Cost', 'Location_Cost', 'VFX_Cost', 'Contingency', 'Date'],
    sheetGid: '1875135310',
  },
  {
    title: 'Contracts',
    description: 'Crew and location contract details.',
    fields: ['Role', 'Contract_ID', 'Daily_Rate', 'Days', 'Total_Payment', 'Signed_Date'],
    sheetGid: '1426488219',
  },
  {
    title: 'Distribution',
    description: 'Distribution metrics and revenue.',
    fields: ['Date', 'Tickets_Sold', 'OTT_Views', 'Total_Revenue'],
    sheetGid: '1188727933',
  },
];

export default function DocumentationPage() {
  const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/11EqidisBCYvDv1hMolIZTJWOTiXs-jbfZAAfw0mSVx4';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation Hub</h1>
        <p className="text-muted-foreground">
          Generate and access shared production documents.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {documentationSections.map((section) => (
          <Dialog key={section.title}>
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 h-32 overflow-y-auto">
                  {section.fields.map((field) => (
                    <li key={field}>{field.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
                <DocumentationDialog />
              </CardContent>
            </Card>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate {section.title} Document</DialogTitle>
                <DialogDescription>
                  This is where a Google Form for '{section.title}' would be embedded. Once submitted, the data would populate the Google Sheet.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 text-center text-muted-foreground">
                <p className="mb-4">(Your Google Form would appear here)</p>
                <a href={`${googleSheetUrl}/edit#gid=${section.sheetGid}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    Go to Google Sheet Tab
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
