'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useScript } from '@/context/script-context';
import { useUser } from '@/firebase';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AppLogo } from '@/components/icons';

export default function Home() {
  const { setScript } = useScript();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const handleGetStarted = () => {
    setIsLoading(true);
    // Let's assume you always want to start with some default script
    // or that the user should go to the dashboard to create one.
    setScript('TITLE: My Awesome Film\n\nSCENE 1\nINT. COFFEE SHOP - DAY\nA young programmer, JANE (20s), types furiously on her laptop.');
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a192f] via-[#123a66] to-[#00c6ff]">
       <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/10 bg-transparent px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
            <AppLogo className="h-6 w-6 text-white" />
        </Link>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial" />
          { !user && !isUserLoading && (
             <Link href="/login">
              <Button variant="outline" className="bg-white/90 text-black hover:bg-white">Login</Button>
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        
        {isUserLoading ? (
          <Loader2 className="h-16 w-16 animate-spin text-white" />
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white max-w-4xl">
              Your Vision, Our Expertise <br/> &mdash; Let's Build Together
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-2xl">
             Turn your idea into a thriving digital product. With our hands-on support in strategy, design, and
development, we'll craft a platform that ensures your launch is nothing short of remarkable. Ready to
make it happen?
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
               <Button size="lg" onClick={handleGetStarted} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
       <footer className="w-full text-center p-4 text-white/60 text-sm">
          CineFlow AI &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
