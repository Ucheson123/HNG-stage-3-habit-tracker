"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '../../lib/constants';
import { getItem, setItem } from '../../lib/storage';
import { User, Session } from '../../types/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getItem<User[]>(STORAGE_KEYS.USERS) || [];

    // TRD Rule: only an existing user with a matching password may log in
    const validUser = users.find((u) => u.email === email && u.password === password);

    if (!validUser) {
      // TRD Rule: invalid login must show exact message
      setError('Invalid email or password');
      return;
    }

    const session: Session = {
      userId: validUser.id,
      email: validUser.email,
    };
    setItem(STORAGE_KEYS.SESSION, session);

    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-400">Welcome Back</h2>
      
      {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-400">Email</label>
        <input
          type="email"
          data-testid="auth-login-email"
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
          data-testid="auth-login-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-md"
        />
      </div>

      <button
        type="submit"
        data-testid="auth-login-submit"
        className="mt-4 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
      >
        Log In
      </button>
    </form>
  );
}