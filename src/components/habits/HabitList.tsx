"use client";

import { Habit } from '../../types/habit';
import HabitCard from './HabitCard';

interface HabitListProps {
  habits: Habit[];
  today: string;
  onToggle: (habit: Habit, date: string) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void; // Added here
}

export default function HabitList({ habits, today, onToggle, onDelete, onEdit }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div data-testid="empty-state" className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
        <p className="text-gray-500">You don't have any habits yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 text-gray-400">
      {habits.map((habit) => (
        <HabitCard 
          key={habit.id} 
          habit={habit} 
          today={today}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit} // Passed down here
        />
      ))}
    </div>
  );
}