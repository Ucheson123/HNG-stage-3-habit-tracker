import { describe, it, expect } from 'vitest';
import { validateHabitName } from '../../src/lib/validators';

describe('validateHabitName', () => {
  it('returns an error when habit name is empty', () => {
    // We pass an empty space and expect the 'valid' flag to be false
    const result = validateHabitName('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Habit name is required');
  });

  it('returns an error when habit name exceeds 60 characters', () => {
    const longName = 'a'.repeat(61); // Quickly generates a 61-character string
    const result = validateHabitName(longName);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Habit name must be 60 characters or fewer');
  });

  it('returns a trimmed value when habit name is valid', () => {
    const result = validateHabitName('  Morning Jog  ');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('Morning Jog'); // Should be cleanly trimmed
    expect(result.error).toBeNull();
  });
});