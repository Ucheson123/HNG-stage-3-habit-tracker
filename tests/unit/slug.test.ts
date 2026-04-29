import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '../../src/lib/slug';

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    // We pass a normal string and expect a hyphenated, lowercase version
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
  });

  it('trims outer spaces and collapses repeated internal spaces', () => {
    // Tests if your regex properly handles messy spacing
    expect(getHabitSlug('  Read   Books  ')).toBe('read-books');
  });

  it('removes non alphanumeric characters except hyphens', () => {
    // Tests if symbols like !, @, # are safely stripped out
    expect(getHabitSlug('Code 100% Every-Day!')).toBe('code-100-every-day');
  });
});