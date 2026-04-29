"use client";

import { useState } from 'react';
import { Habit } from '../../types/habit';
import { getHabitSlug } from '../../lib/slug';
import { calculateCurrentStreak } from '../../lib/streaks';

interface HabitCardProps {
  habit: Habit;
  today: string;
  onToggle: (habit: Habit, date: string) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void; // The new prop for the edit action
}

export default function HabitCard({ habit, today, onToggle, onDelete, onEdit }: HabitCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const slug = getHabitSlug(habit.name);
  const currentStreak = calculateCurrentStreak(habit.completions, today);
  const isCompletedToday = habit.completions.includes(today);

  return (
    <div 
      data-testid={`habit-card-${slug}`} 
      className={`p-4 rounded-lg border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${
        isCompletedToday ? 'bg-green-50 border-green-200' : 'bg-white'
      }`}
    >
      <div className="flex-1">
        <h3 className="font-bold text-lg">{habit.name}</h3>
        {habit.description && <p className="text-gray-600 text-sm">{habit.description}</p>}
        <p 
          data-testid={`habit-streak-${slug}`} 
          className="text-sm font-medium mt-1 text-blue-600"
        >
          🔥 Streak: {currentStreak} days
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit, today)}
          className={`px-4 py-2 rounded-md font-medium transition ${
            isCompletedToday ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {isCompletedToday ? 'Completed' : 'Mark Complete'}
        </button>

        {/* THE NEW EDIT BUTTON */}
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="px-3 py-2 text-blue-500 hover:bg-blue-50 rounded-md"
        >
          Edit
        </button>

        {isConfirmingDelete ? (
          <button
            data-testid="confirm-delete-button"
            onClick={() => onDelete(habit.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
          >
            Confirm?
          </button>
        ) : (
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setIsConfirmingDelete(true)}
            className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-md"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}