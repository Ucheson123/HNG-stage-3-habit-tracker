import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SignupForm from '../../src/components/auth/SignupForm';
import LoginForm from '../../src/components/auth/LoginForm';
import { STORAGE_KEYS } from '../../src/lib/constants';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // THIS IS THE MAGIC FIX: Destroy the DOM after every test
  afterEach(() => {
    cleanup();
  });

  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
    expect(session).not.toBeNull();
    expect(session.email).toBe('new@test.com');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for duplicate signup email', async () => {
    const existingUser = { id: '1', email: 'exist@test.com', password: '123', createdAt: 'now' };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([existingUser]));

    render(<SignupForm />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'exist@test.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'newpass' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(await screen.findByText('User already exists')).toBeDefined();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('submits the login form and stores the active session', async () => {
    const user = { id: '1', email: 'user@test.com', password: 'password123', createdAt: 'now' };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([user]));

    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
    expect(session.userId).toBe('1');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(await screen.findByText('Invalid email or password')).toBeDefined();
  });
});