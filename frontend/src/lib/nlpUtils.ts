// frontend/src/lib/nlpUtils.ts

/**
 * Natural Language Processing utilities for task management
 */

export interface ParsedCommand {
  action: 'add' | 'complete' | 'delete' | 'update' | 'list' | 'none';
  title?: string;
  dueDate?: string;
  time?: string;
  taskId?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export const parseNaturalLanguageCommand = (input: string): ParsedCommand => {
  const lowerInput = input.toLowerCase().trim();
  
  // Check for completion commands
  if (lowerInput.includes('complete') || lowerInput.includes('done') || lowerInput.includes('finish')) {
    const taskIdMatch = lowerInput.match(/(\d+|task \d+)/);
    return {
      action: 'complete',
      taskId: taskIdMatch ? taskIdMatch[0] : undefined
    };
  }
  
  // Check for deletion commands
  if (lowerInput.includes('delete') || lowerInput.includes('remove')) {
    const taskIdMatch = lowerInput.match(/(\d+|task \d+)/);
    return {
      action: 'delete',
      taskId: taskIdMatch ? taskIdMatch[0] : undefined
    };
  }
  
  // Check for listing commands
  if (lowerInput.includes('show') || lowerInput.includes('list') || lowerInput.includes('view')) {
    return {
      action: 'list'
    };
  }
  
  // Check for adding commands
  if (lowerInput.includes('add') || lowerInput.includes('create') || lowerInput.includes('new')) {
    // Extract title (everything after "add" or "create")
    const titleMatch = lowerInput.match(/(?:add|create|new)\s+(.+?)(?:\s+for\s+\w+|\s+tomorrow|\s+today|\s+tonight|\s+at\s+\d+|\s+by\s+\d+|$)/i);
    
    // Extract due date/time
    let dueDate: string | undefined;
    let time: string | undefined;
    
    // Check for "tomorrow"
    if (lowerInput.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow.toISOString().split('T')[0];
    }
    // Check for "today"
    else if (lowerInput.includes('today')) {
      dueDate = new Date().toISOString().split('T')[0];
    }
    // Check for "tonight"
    else if (lowerInput.includes('tonight')) {
      const tonight = new Date();
      dueDate = tonight.toISOString().split('T')[0];
      time = '20:00'; // Default to 8 PM
    }
    // Check for specific dates
    else {
      const dateMatch = lowerInput.match(/(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)/);
      if (dateMatch) {
        // Convert to ISO format
        const dateParts = dateMatch[0].split(/[\/\-]/);
        if (dateParts.length >= 2) {
          const month = parseInt(dateParts[0]) - 1; // JS months are 0-indexed
          const day = parseInt(dateParts[1]);
          const year = dateParts[2] ? parseInt(dateParts[2]) : new Date().getFullYear();
          
          const date = new Date(year, month, day);
          dueDate = date.toISOString().split('T')[0];
        }
      }
      
      // Check for time
      const timeMatch = lowerInput.match(/at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3]?.toLowerCase();
        
        // Convert to 24-hour format if needed
        if (period === 'pm' && hours < 12) {
          hours += 12;
        } else if (period === 'am' && hours === 12) {
          hours = 0;
        }
        
        time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    
    // Extract priority
    let priority: 'low' | 'medium' | 'high' | undefined;
    if (lowerInput.includes('urgent') || lowerInput.includes('important') || lowerInput.includes('high priority')) {
      priority = 'high';
    } else if (lowerInput.includes('low priority') || lowerInput.includes('not urgent')) {
      priority = 'low';
    } else if (lowerInput.includes('medium priority')) {
      priority = 'medium';
    }
    
    // Extract category
    let category: string | undefined;
    if (lowerInput.includes('work')) {
      category = 'work';
    } else if (lowerInput.includes('personal')) {
      category = 'personal';
    } else if (lowerInput.includes('shopping')) {
      category = 'shopping';
    } else if (lowerInput.includes('health') || lowerInput.includes('medical')) {
      category = 'health';
    }
    
    return {
      action: 'add',
      title: titleMatch ? titleMatch[1].trim() : input.replace(/^(add|create|new)\s*/i, ''),
      dueDate,
      time,
      priority,
      category
    };
  }
  
  // Default to no action
  return {
    action: 'none'
  };
};

export const generateSmartSuggestions = (hour: number): string[] => {
  const suggestions: string[] = [];
  
  if (hour >= 6 && hour < 9) {
    suggestions.push("Good morning! Add your daily tasks");
    suggestions.push("Review your goals for the day");
  } else if (hour >= 9 && hour < 12) {
    suggestions.push("Time for focused work tasks");
    suggestions.push("Check your calendar for meetings");
  } else if (hour >= 12 && hour < 14) {
    suggestions.push("Don't forget to eat lunch");
    suggestions.push("Take a short break after eating");
  } else if (hour >= 14 && hour < 17) {
    suggestions.push("Handle afternoon tasks");
    suggestions.push("Follow up on pending items");
  } else if (hour >= 17 && hour < 19) {
    suggestions.push("Wrap up work tasks for the day");
    suggestions.push("Plan tomorrow's priorities");
  } else if (hour >= 19 && hour < 22) {
    suggestions.push("Personal time - relax and recharge");
    suggestions.push("Evening routine tasks");
  } else {
    suggestions.push("Get some rest");
    suggestions.push("Prepare for tomorrow");
  }
  
  return suggestions;
};