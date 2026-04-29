import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../src/lib/habits';
import { Habit } from '../../src/types/habit';

describe('toggleHabitCompletion', () => {
  // We set up a "mock" habit object to test against
  const mockHabit: Habit = {
    id: '1',
    userId: 'user-1',
    name: 'Read',
    description: '',
    frequency: 'daily',
    createdAt: '2026-04-01',
    completions: ['2026-04-25'],
  };

  it('adds a completion date when the date is not present', () => {
    const updatedHabit = toggleHabitCompletion(mockHabit, '2026-04-26');
    // We expect the array to now contain both the old date and the new date
    expect(updatedHabit.completions).toEqual(['2026-04-25', '2026-04-26']);
  });

  it('removes a completion date when the date already exists', () => {
    // Toggling '2026-04-25' again should remove it
    const updatedHabit = toggleHabitCompletion(mockHabit, '2026-04-25');
    expect(updatedHabit.completions).toEqual([]);
  });

  it('does not mutate the original habit object', () => {
    const originalCompletions = [...mockHabit.completions];
    toggleHabitCompletion(mockHabit, '2026-04-27');
    
    // We assert that the original mock object was left completely untouched (crucial for React state)
    expect(mockHabit.completions).toEqual(originalCompletions);
  });

  it('does not return duplicate completion dates', () => {
    const corruptedHabit = { ...mockHabit, completions: ['2026-04-25', '2026-04-25'] };
    const updatedHabit = toggleHabitCompletion(corruptedHabit, '2026-04-26');
    
    // It should clean up the duplicates and add the new one
    expect(updatedHabit.completions).toEqual(['2026-04-25', '2026-04-26']);
  });
});