"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '../components/shared/SplashScreen';
import { STORAGE_KEYS } from '../lib/constants';
import { getItem } from '../lib/storage';
import { Session } from '../types/auth';

export default function RootPage() {
  const router = useRouter();

  // useEffect runs side-effects (like timers and localStorage checks) after the component renders
  useEffect(() => {
    // TRD Target duration: between 800ms and 2000ms. We'll use 1200ms.
    const timer = setTimeout(() => {
      // Check if a valid session exists in local storage
      const session = getItem<Session>(STORAGE_KEYS.SESSION);

      if (session && session.userId) {
        // TRD Rule: redirect to /dashboard when a session exists
        router.push('/dashboard');
      } else {
        // TRD Rule: redirect to /login when a session does not exist
        router.push('/login');
      }
    }, 1200);

    // Cleanup function to clear the timer if the component unmounts unexpectedly
    return () => clearTimeout(timer);
  }, [router]);

  // While the useEffect is running its 1200ms timer, the user sees this:
  return <SplashScreen />;
}