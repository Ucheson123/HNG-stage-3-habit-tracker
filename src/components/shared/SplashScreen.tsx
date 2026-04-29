"use client";

export default function SplashScreen() {
  return (
    // Tailwind classes to perfectly center the content on the screen
    <div 
      data-testid="splash-screen" 
      className="flex min-h-screen items-center justify-center bg-blue-600 text-white"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Habit Tracker</h1>
        <p className="mt-2 text-blue-100">Loading your routine...</p>
      </div>
    </div>
  );
}