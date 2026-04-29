import { Habit } from '../types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  let newCompletions: string[];

  if (habit.completions.includes(date)) {
    newCompletions = habit.completions.filter((d) => d !== date);
  } else {
    newCompletions = [...habit.completions, date];
  }

  const deduplicatedCompletions = [...new Set(newCompletions)];

  return {
    ...habit,
    completions: deduplicatedCompletions,
  };
}