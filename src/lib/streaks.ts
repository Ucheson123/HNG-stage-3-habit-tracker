const getYesterdayString = (dateStr: string): string => {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1); 
  return date.toISOString().split('T')[0]; 
};

export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (!today || !completions.includes(today)) {
    return 0;
  }

  const uniqueCompletions = [...new Set(completions)];
  uniqueCompletions.sort((a, b) => b.localeCompare(a));

  let currentStreak = 0;
  let targetDateToCheck = today;

  for (const completedDate of uniqueCompletions) {
    if (completedDate === targetDateToCheck) {
      currentStreak++;
      targetDateToCheck = getYesterdayString(targetDateToCheck);
    } else if (completedDate > targetDateToCheck) {
       continue;
    } else {
      break; 
    }
  }

  return currentStreak;
}