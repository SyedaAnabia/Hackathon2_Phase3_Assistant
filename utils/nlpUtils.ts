// utils/nlpUtils.ts

// Common typos and their corrections
const typoMap: Record<string, string> = {
  'taks': 'tasks',
  'tak': 'task',
  'complte': 'complete',
  'cmplete': 'complete',
  'complet': 'complete',
  'tod': 'todo',
  'tdo': 'todo',
  'remov': 'remove',
  'rmove': 'remove',
  'delte': 'delete',
  'delet': 'delete',
  'ad': 'add',
  'dd': 'add',
  'cretae': 'create',
  'cret': 'create',
  'lst': 'list',
  'lis': 'list',
  'shw': 'show',
  'sho': 'show',
  'edt': 'edit',
  'edti': 'edit',
  'updte': 'update',
  'updat': 'update',
  'finsh': 'finish',
  'fnish': 'finish',
  'don': 'done',
  'dn': 'done',
  'tmrw': 'tomorrow',
  'tmrrow': 'tomorrow',
  'tdy': 'today',
  'tdya': 'today',
  'hr': 'hour',
  'hrs': 'hours',
  'mnt': 'minute',
  'mnts': 'minutes',
  'wk': 'week',
  'wks': 'weeks',
  'mnth': 'month',
  'mnths': 'months',
  'yr': 'year',
  'yrs': 'years',
  'prsnl': 'personal',
  'wrk': 'work',
  'shpng': 'shopping',
  'hlth': 'health',
  'fnnce': 'finance',
  'othr': 'other',
  'hgh': 'high',
  'medum': 'medium',
  'lw': 'low'
};

// Common synonyms
const synonymMap: Record<string, string[]> = {
  'add': ['create', 'new', 'make'],
  'complete': ['done', 'finish', 'accomplish'],
  'delete': ['remove', 'kill', 'eliminate'],
  'list': ['show', 'view', 'display'],
  'edit': ['update', 'modify', 'change'],
  'task': ['todo', 'item', 'reminder', 'note'],
  'tomorrow': ['tmrw'],
  'today': ['tdy'],
  'work': ['job', 'office', 'career'],
  'personal': ['private', 'my', 'me'],
  'shopping': ['buy', 'purchase', 'grocery'],
  'health': ['medical', 'fitness', 'exercise'],
  'finance': ['money', 'budget', 'financial'],
  'high': ['urgent', 'important', 'critical'],
  'medium': ['normal', 'standard', 'regular'],
  'low': ['optional', 'minor', 'trivial']
};

/**
 * Corrects common typos in the input text
 */
export function spellCorrect(input: string): string {
  // Split the input into words
  const words = input.split(/\s+/);
  
  // Correct each word if it's a known typo
  const correctedWords = words.map(word => {
    // Remove punctuation for comparison
    const cleanWord = word.toLowerCase().replace(/[^\w\s]|_/g, '');
    
    // Check if it's a typo
    if (typoMap[cleanWord]) {
      // Preserve capitalization
      const originalWord = word;
      const corrected = typoMap[cleanWord];
      
      // Match the capitalization pattern
      if (originalWord === originalWord.toUpperCase()) {
        return corrected.toUpperCase();
      } else if (originalWord[0] === originalWord[0].toUpperCase()) {
        return corrected.charAt(0).toUpperCase() + corrected.slice(1);
      }
      
      return corrected;
    }
    
    return word;
  });
  
  return correctedWords.join(' ');
}

/**
 * Finds synonyms for a given word
 */
export function findSynonyms(word: string): string[] {
  const lowerWord = word.toLowerCase();
  return synonymMap[lowerWord] || [];
}

/**
 * Performs fuzzy matching between two strings
 * Returns a score between 0 and 1, where 1 is a perfect match
 */
export function fuzzyMatch(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Perfect match
  if (s1 === s2) return 1.0;
  
  // If one string is empty
  if (s1.length === 0 || s2.length === 0) return 0.0;
  
  // If one string contains the other
  if (s1.includes(s2) || s2.includes(s1)) {
    return Math.max(s1.length, s2.length) / (s1.length + s2.length);
  }
  
  // Levenshtein distance algorithm
  const matrix: number[][] = [];
  
  // Initialize matrix
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  // Calculate similarity ratio
  const distance = matrix[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  
  return 1 - (distance / maxLength);
}

/**
 * Finds the best matching option from a list of options
 */
export function findBestMatch(input: string, options: string[]): { match: string, score: number } | null {
  if (!options || options.length === 0) return null;
  
  let bestMatch: { match: string, score: number } | null = null;
  
  for (const option of options) {
    const score = fuzzyMatch(input, option);
    
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { match: option, score };
    }
  }
  
  return bestMatch;
}

/**
 * Expands a command by replacing synonyms
 */
export function expandCommand(input: string): string[] {
  const words = input.split(/\s+/);
  const expanded: string[] = [input]; // Start with the original
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase();
    const synonyms = findSynonyms(word);
    
    if (synonyms.length > 0) {
      // Create variations by replacing the word with each synonym
      const newVariations: string[] = [];
      
      for (const variation of expanded) {
        const varWords = variation.split(/\s+/);
        
        for (const synonym of synonyms) {
          const newVar = [...varWords];
          newVar[i] = synonym;
          newVariations.push(newVar.join(' '));
        }
      }
      
      expanded.push(...newVariations);
    }
  }
  
  return Array.from(new Set(expanded)); // Remove duplicates
}