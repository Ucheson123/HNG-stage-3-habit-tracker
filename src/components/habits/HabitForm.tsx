"use client";

import { useState } from 'react';
import { validateHabitName } from '../../lib/validators';
import { Habit } from '../../types/habit';

interface HabitFormProps {
  userId: string;
  initialHabit?: Habit | null; // Allows us to pass in a habit to edit
  onSave: (habit: Habit) => void;
  onCancel: () => void;
}

export default function HabitForm({ userId, initialHabit, onSave, onCancel }: HabitFormProps) {
  // If we pass in an initialHabit, fill the form with its data. Otherwise, leave it blank.
  const [name, setName] = useState(initialHabit?.name || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid name');
      return;
    }

    const updatedHabit: Habit = {
      // If editing, keep the old ID. If creating new, generate a new ID.
      id: initialHabit ? initialHabit.id : crypto.randomUUID(), 
      userId,
      name: validation.value,
      description: description.trim(),
      frequency: 'daily',
      // If editing, keep the original creation date and history.
      createdAt: initialHabit ? initialHabit.createdAt : new Date().toISOString(),
      completions: initialHabit ? initialHabit.completions : [],
    };

    onSave(updatedHabit);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      data-testid="habit-form" 
      className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-col gap-3"
    >
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      
      <input 
        type="text" 
        placeholder="Habit Name" 
        data-testid="habit-name-input" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="border p-2 rounded-md w-full text-gray-400" 
      />
      
      <input 
        type="text" 
        placeholder="Description" 
        data-testid="habit-description-input" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className="border p-2 rounded-md w-full text-gray-400" 
      />
      
      <select 
        data-testid="habit-frequency-select" 
        disabled 
        className="border p-2 rounded-md bg-gray-100 text-gray-500 w-full"
      >
        <option value="daily">Daily</option>
      </select>
      
      <div className="flex gap-2 justify-end mt-2">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          data-testid="habit-save-button" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Habit
        </button>
      </div>
    </form>
  );
}