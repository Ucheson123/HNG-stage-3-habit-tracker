"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '../../lib/constants';
import { getItem, setItem } from '../../lib/storage';
import { Session } from '../../types/auth';
import { Habit } from '../../types/habit';
import { toggleHabitCompletion } from '../../lib/habits';
import HabitForm from '../../components/habits/HabitForm';
import HabitList from '../../components/habits/HabitList';

const getTodayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DashboardPage() {
  const router = useRouter();
  
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null); 
  const [isClient, setIsClient] = useState(false);

  const today = getTodayString();

  useEffect(() => {
    setIsClient(true);
    const activeSession = getItem<Session>(STORAGE_KEYS.SESSION);
    
    if (!activeSession) {
      router.push('/login');
      return;
    }

    setSession(activeSession);

    const allHabits = getItem<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const userHabits = allHabits.filter((h) => h.userId === activeSession.userId);
    setHabits(userHabits);
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
    router.push('/login');
  };

  const updateLocalStorage = (updatedUserHabits: Habit[], currentUserId: string) => {
    const allHabits = getItem<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const otherUsersHabits = allHabits.filter(h => h.userId !== currentUserId);
    setItem(STORAGE_KEYS.HABITS, [...otherUsersHabits, ...updatedUserHabits]);
  };

  // Notice how handleAddHabit is now gone, replaced by handleSaveHabit!
  const handleSaveHabit = (savedHabit: Habit) => {
    let newHabits;
    
    if (editingHabit) {
      newHabits = habits.map(h => h.id === savedHabit.id ? savedHabit : h);
    } else {
      newHabits = [...habits, savedHabit];
    }
    
    setHabits(newHabits);
    updateLocalStorage(newHabits, session!.userId);
    setIsFormOpen(false);
    setEditingHabit(null);
  };

  // Here is the missing function that your code was looking for!
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleToggleCompletion = (habit: Habit, date: string) => {
    const updatedHabit = toggleHabitCompletion(habit, date);
    const newHabits = habits.map(h => h.id === habit.id ? updatedHabit : h);
    setHabits(newHabits);
    updateLocalStorage(newHabits, session!.userId);
  };

  const handleDeleteHabit = (habitId: string) => {
    const newHabits = habits.filter(h => h.id !== habitId);
    setHabits(newHabits);
    updateLocalStorage(newHabits, session!.userId);
  };

  if (!isClient || !session) return null; 

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold">My Habits</h1>
          <button 
            onClick={handleLogout}
            data-testid="auth-logout-button"
            className="text-gray-600 hover:text-red-600 font-medium"
          >
            Logout
          </button>
        </header>

        {isFormOpen ? (
          <HabitForm 
            userId={session.userId} 
            initialHabit={editingHabit} 
            onSave={handleSaveHabit} 
            onCancel={() => {
              setIsFormOpen(false);
              setEditingHabit(null);
            }} 
          />
        ) : (
          <button
            onClick={() => setIsFormOpen(true)}
            data-testid="create-habit-button"
            className="mb-6 w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
          >
            + Create New Habit
          </button>
        )}

        <HabitList 
          habits={habits} 
          today={today}
          onToggle={handleToggleCompletion}
          onDelete={handleDeleteHabit}
          onEdit={handleEditHabit} 
        />
      </div>
    </div>
  );
}