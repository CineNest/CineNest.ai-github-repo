'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DocLinkButton } from '@/components/app/doc-link-button';

const documentationSections = [
  {
    title: 'Plan',
    description: 'Production plan and schedule.',
    fields: ['Shooting_Days', 'Locations', 'Weather', 'Equipment_List'],
    sheetGid: '0', // Example GID, you would replace these with actual GIDs
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
    title: 'Status',
    description: 'Daily production status logs.',
    fields: ['Date', 'Status', 'Phase'],
    sheetGid: '998493108',
  },
  {
    title: 'Distribution',
    description: 'Distribution metrics and revenue.',
    fields: ['Date', 'Tickets_Sold', 'OTT_Views', 'Total_Revenue'],
    sheetGid: '1188727933',
  },
  {
    title: 'AI_Analysis',
    description: 'AI-generated script and production analysis.',
    fields: ['Timestamp', 'Days', 'Locations', 'Crew_Count', 'Equipment_Count', 'Weather', 'Shot_Count', 'Camera_Movement_Count', 'Lighting', 'VFX_Count'],
    sheetGid: '1979313886',
  },
  {
    title: 'Logs',
    description: 'System and production logs.',
    fields: ['Timestamp', 'Type', 'Days', 'Locations', 'Crew_Count', 'Equipment_Count', 'VFX_Count', 'Status'],
    sheetGid: '969966147',
  },
];

export default function DocumentationPage() {
  const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/11EqidisBCYvDv1hMolIZTJWOTiXs-jbfZAAfw0mSVx4';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation Hub</h1>
        <p className="text-muted-foreground">
          Generate and access shared production documents via Google Sheets.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {documentationSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {section.fields.map((field) => (
                  <li key={field}>{field.replace(/_/g, ' ')}</li>
                ))}
              </ul>
              <DocLinkButton
                baseUrl={googleSheetUrl}
                gid={section.sheetGid}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}