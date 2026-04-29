/**
 * Generic helper to safely read from localStorage.
 * It returns null if the key doesn't exist or if we are on the server.
 */
export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null; // Prevents Next.js server crash
  
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    return JSON.parse(item) as T;
  } catch {
    return null; // Fails gracefully if the JSON is somehow corrupted
  }
}

/**
 * Generic helper to safely write to localStorage.
 */
export function setItem<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}