"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Must be next/navigation in App Router
import { STORAGE_KEYS } from '../../lib/constants';
import { getItem, setItem } from '../../lib/storage';
import { User, Session } from '../../types/auth';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    setError('');

    // Fetch existing users from localStorage, or default to an empty array
    const users = getItem<User[]>(STORAGE_KEYS.USERS) || [];

    // TRD Rule: duplicate email signup must be rejected
    const userExists = users.some((u) => u.email === email);
    if (userExists) {
      setError('User already exists');
      return;
    }

    // Create the new user
    const newUser: User = {
      id: crypto.randomUUID(), // Generates a unique ID
      email,
      password, // In a real app, never store plain text passwords! But required here for local mock auth.
      createdAt: new Date().toISOString(),
    };

    // Save the updated users list
    setItem(STORAGE_KEYS.USERS, [...users, newUser]);

    // TRD Rule: create a session in local storage
    const newSession: Session = {
      userId: newUser.id,
      email: newUser.email,
    };
    setItem(STORAGE_KEYS.SESSION, newSession);

    // TRD Rule: redirect to /dashboard
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-400">Create Account</h2>
      
      {/* Tailwind handles styling the error message */}
      {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-400">Email</label>
        <input
          type="email"
          data-testid="auth-signup-email" // Exact TRD requirement
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-md"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-400">Password</label>
        <input
          type="password"
          data-testid="auth-signup-password" // Exact TRD requirement
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-md"
        />
      </div>

      <button
        type="submit"
        data-testid="auth-signup-submit" // Exact TRD requirement
        className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
      >
        Sign Up
      </button>
    </form>
  );
}