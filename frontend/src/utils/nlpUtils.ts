// frontend/src/utils/nlpUtils.ts

export const fuzzyMatch = (input: string, target: string): boolean => {
  // Simple fuzzy matching logic
  const inputLower = input.toLowerCase();
  const targetLower = target.toLowerCase();
  return inputLower.includes(targetLower) || targetLower.includes(inputLower);
};

export const spellCorrect = (text: string): string => {
  // Simple spell correction for common typos
  const corrections: Record<string, string> = {
    'taks': 'tasks',
    'tak': 'task',
    'taask': 'task',
    'tsak': 'task',
  };
  
  let corrected = text;
  Object.entries(corrections).forEach(([wrong, correct]) => {
    corrected = corrected.replace(new RegExp(wrong, 'gi'), correct);
  });
  
  return corrected;
};