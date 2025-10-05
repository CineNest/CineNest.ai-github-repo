'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, BrainCircuit, Rows, Database, Share2 } from 'lucide-react';

const techStack = [
  {
    icon: Layers,
    category: 'Core Framework: Next.js & React',
    details: 'The foundation of our application. We use Next.js 15 with the App Router, which provides a robust structure for building fast, server-rendered React applications. This enables excellent performance and a file-based routing system that\'s easy to manage.',
    example: 'The entire `src/app/` directory, with its `page.tsx` and `layout.tsx` files, is a perfect example of the Next.js App Router in action.'
  },
  {
    icon: BrainCircuit,
    category: 'Artificial Intelligence: Google\'s Gemini & Genkit',
    details: 'The "brain" behind all smart features. We use Google\'s Gemini 2.5 Flash model and the Genkit framework to structure, run, and manage our AI flows for tasks like script analysis and legal advice.',
    example: 'The `src/ai/flows/` directory contains all our AI logic, such as `legal-advisor-flow.ts`, which defines the prompts and logic for the Gemini model.'
  },
  {
    icon: Rows,
    category: 'UI & Styling: ShadCN/UI & Tailwind CSS',
    details: 'The building blocks of our user interface. ShadCN/UI provides a set of reusable, accessible components (Cards, Buttons, Forms), while Tailwind CSS is used for all styling, allowing for rapid UI development.',
    example: 'The `src/components/ui/` directory holds all the base components. You can see them used on every page, like the cards and forms on the Legal page.'
  },
  {
    icon: Database,
    category: 'Database & Authentication: Firebase',
    details: 'Our backend-as-a-service. We use Firebase Authentication for user sign-up/login and Firestore as our real-time NoSQL database to store user profiles and production status logs.',
    example: 'The `src/firebase/` directory contains all configuration and hooks. The login page uses Firebase Auth, and the profile page fetches data from Firestore.'
  },
  {
    icon: Share2,
    category: 'State Management: React Context API',
    details: 'The glue that holds our application\'s data together on the frontend. We use React\'s built-in Context API to share state (like the movie script and transactions) across different pages and components.',
    example: '`src/context/script-context.tsx` defines the shared state for the application, ensuring data is synchronized across the dashboard.'
  }
];

export default function TechStackPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tech Stack</h1>
        <p className="text-muted-foreground">
          A summary of the technologies used to build CineFlow AI.
        </p>
      </div>

      <div className="space-y-6">
        {techStack.map((tech) => (
          <Card key={tech.category}>
            <CardHeader className="flex flex-row items-start gap-4">
              <tech.icon className="h-8 w-8 text-primary mt-1" />
              <div>
                <CardTitle>{tech.category}</CardTitle>
                <CardDescription>{tech.details}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
                <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-semibold">Where to see it:</p>
                    <p className="text-sm text-muted-foreground font-mono">{tech.example}</p>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
