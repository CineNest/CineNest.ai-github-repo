'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2, Phone, UserCircle } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, {
    message: 'Please enter a valid phone number with country code.',
  }),
});

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: 'OTP must be 6 digits.',
  }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const auth = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });
  
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
        otp: '',
    },
  });

  useEffect(() => {
    if (auth && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [auth]);

  async function onSendOtp(values: z.infer<typeof phoneSchema>) {
    setIsLoading(true);
    try {
      if (!auth) throw new Error('Firebase Auth not available.');
      const verifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, values.phoneNumber, verifier);
      setConfirmationResult(result);
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${values.phoneNumber}.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to Send OTP',
        description: error.message || 'Please check the phone number and try again.',
      });
      // Reset reCAPTCHA if it fails
      window.recaptchaVerifier.render().then((widgetId: any) => {
        grecaptcha.reset(widgetId);
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function onVerifyOtp(values: z.infer<typeof otpSchema>) {
    if (!confirmationResult) return;
    setIsLoading(true);
    try {
        await confirmationResult.confirm(values.otp);
        // User is signed in. onAuthStateChanged will redirect to dashboard.
        router.push('/dashboard');
    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'The OTP is incorrect. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-[#0a192f] via-[#123a66] to-[#00c6ff]">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-white/20">
          <CardHeader className="items-center text-center">
            <UserCircle className="h-16 w-16 text-primary" />
            <CardTitle className="text-3xl font-headline tracking-tight">Sign In / Sign Up</CardTitle>
            <CardDescription>Enter your phone number to receive a verification code.</CardDescription>
          </CardHeader>
          <CardContent>
            {!confirmationResult ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSendOtp)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="+91 98765 43210" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send OTP
                  </Button>
                </form>
              </Form>
            ) : (
                 <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                        <FormField
                            control={otpForm.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the 6-digit code" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify & Log In
                        </Button>
                         <Button variant="link" size="sm" onClick={() => setConfirmationResult(null)} className="w-full">
                            Use a different phone number
                        </Button>
                    </form>
              </Form>
            )}
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Go back to{' '}
              <Link href="/" className="underline hover:text-primary">
                Home
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
