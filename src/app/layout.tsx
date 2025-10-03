import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ScriptProvider } from '@/context/script-context';
import { ThemeProvider } from '@/components/app/theme-provider';

export const metadata: Metadata = {
  title: 'CineFlow AI',
  description: 'Streamline your filmmaking process with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ScriptProvider>
            {children}
          </ScriptProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
