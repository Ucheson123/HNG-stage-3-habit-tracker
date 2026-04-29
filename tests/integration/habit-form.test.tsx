import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import DashboardPage from '../../src/app/dashboard/page';
import { STORAGE_KEYS } from '../../src/lib/constants';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ userId: '1', email: 'test@test.com' }));
  });

  // Clean up the DOM to prevent memory leaks and duplicate elements
  afterEach(() => {
    cleanup();
  });

  it('shows a validation error when habit name is empty', async () => {
    render(<DashboardPage />);
    const createBtn = await screen.findByTestId('create-habit-button');
    fireEvent.click(createBtn);
    fireEvent.click(screen.getByTestId('habit-save-button'));
    expect(await screen.findByText('Habit name is required')).toBeDefined();
  });

  it('creates a new habit and renders it in the list', async () => {
    render(<DashboardPage />);
    const createBtn = await screen.findByTestId('create-habit-button');
    fireEvent.click(createBtn);
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Drink Water' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    expect(await screen.findByTestId('habit-card-drink-water')).toBeDefined();
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const existingHabit = { id: 'h1', userId: '1', name: 'Old Name', description: '', frequency: 'daily' as const, createdAt: '2026-01-01', completions: ['2026-04-20'] };
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([existingHabit]));
    
    render(<DashboardPage />);
    const editBtn = await screen.findByTestId('habit-edit-old-name');
    fireEvent.click(editBtn);
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'New Name' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    expect(await screen.findByTestId('habit-card-new-name')).toBeDefined();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
    expect(saved[0].id).toBe('h1');
    expect(saved[0].createdAt).toBe('2026-01-01');
    expect(saved[0].completions).toContain('2026-04-20');
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const existingHabit = { id: 'h1', userId: '1', name: 'To Delete', description: '', frequency: 'daily' as const, createdAt: '2026-01-01', completions: [] };
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([existingHabit]));
    
    render(<DashboardPage />);
    const deleteBtn = await screen.findByTestId('habit-delete-to-delete');
    fireEvent.click(deleteBtn);
    const confirmBtn = await screen.findByTestId('confirm-delete-button');
    fireEvent.click(confirmBtn);
    
    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-to-delete')).toBeNull();
    });
  });

  it('toggles completion and updates the streak display', async () => {
    const existingHabit = { id: 'h1', userId: '1', name: 'Read', description: '', frequency: 'daily' as const, createdAt: '2026-01-01', completions: [] };
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([existingHabit]));
    
    render(<DashboardPage />);
    const streakText = await screen.findByTestId('habit-streak-read');
    expect(streakText.textContent).toContain('0');
    
    fireEvent.click(screen.getByTestId('habit-complete-read'));
    
    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-read').textContent).toContain('1');
    });
  });
});