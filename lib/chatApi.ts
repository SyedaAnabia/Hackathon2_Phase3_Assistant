// lib/chatApi.ts
import { ChatRequest, ChatResponse } from '@/types';
import { todoService } from './todoService';
import { TodoCreate } from '@/types';

// Simple in-memory storage for conversations
const conversations: Record<string, any> = {};

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      // Parse the message to determine intent
      const { intent, params } = parseMessage(request.message);

      // Process the intent
      let responseText = '';

      switch (intent) {
        case 'add_task':
          responseText = await handleAddTask(params);
          break;
        case 'complete_task':
          responseText = await handleCompleteTask(params);
          break;
        case 'list_tasks':
          responseText = await handleListTasks(params);
          break;
        case 'delete_task':
          responseText = await handleDeleteTask(params);
          break;
        case 'edit_task':
          responseText = await handleEditTask(params);
          break;
        case 'greeting':
          responseText = "Hello! I'm your AI assistant. You can ask me to add tasks, complete tasks, or anything else you need help with.";
          break;
        case 'help':
          responseText = "I can help you manage your tasks. Try commands like: 'add buy milk tomorrow', 'complete task 1', 'list tasks', 'delete task 2', or 'edit task 3'.";
          break;
        default:
          responseText = "I'm not sure how to help with that. Try asking me to add, complete, list, or delete tasks.";
      }

      // Generate a conversation ID if not provided
      const conversationId = request.conversationId || generateConversationId();

      return {
        conversation_id: conversationId,
        response: responseText
      };
    } catch (error) {
      console.error('Error processing chat message:', error);
      return {
        conversation_id: request.conversationId || generateConversationId(),
        response: 'Sorry, I encountered an error processing your request.'
      };
    }
  }
};

// Helper function to parse user message
function parseMessage(message: string) {
  // Normalize the message
  const normalized = message.toLowerCase().trim();

  // Intent detection
  if (normalized.includes('hello') || normalized.includes('hi') || normalized.includes('hey')) {
    return { intent: 'greeting', params: {} };
  }

  if (normalized.includes('help') || normalized.includes('what can you do')) {
    return { intent: 'help', params: {} };
  }

  // Add task detection
  if (normalized.startsWith('add ') || normalized.startsWith('create ') || normalized.startsWith('new ')) {
    const taskText = normalized.substring(normalized.indexOf(' ') + 1).trim();
    return {
      intent: 'add_task',
      params: parseTaskDetails(taskText)
    };
  }

  // Complete task detection
  if (normalized.includes('complete ') || normalized.includes('done ') || normalized.includes('finish ')) {
    const match = normalized.match(/(?:complete|done|finish) (?:task )?(\d+)/i);
    if (match) {
      return {
        intent: 'complete_task',
        params: { taskId: match[1] }
      };
    }

    // If no specific task number, try to find by title
    const taskTitle = normalized.replace(/(?:complete|done|finish) (?:task )?/, '').trim();
    return {
      intent: 'complete_task',
      params: { taskTitle }
    };
  }

  // List tasks detection
  if (normalized.includes('list ') || normalized.includes('show ') || normalized.includes('view ')) {
    return {
      intent: 'list_tasks',
      params: {}
    };
  }

  // Delete task detection
  if (normalized.includes('delete ') || normalized.includes('remove ') || normalized.includes('kill ')) {
    const match = normalized.match(/(?:delete|remove|kill) (?:task )?(\d+)/i);
    if (match) {
      return {
        intent: 'delete_task',
        params: { taskId: match[1] }
      };
    }

    // If no specific task number, try to find by title
    const taskTitle = normalized.replace(/(?:delete|remove|kill) (?:task )?/, '').trim();
    return {
      intent: 'delete_task',
      params: { taskTitle }
    };
  }

  // Edit task detection
  if (normalized.includes('edit ') || normalized.includes('update ')) {
    const match = normalized.match(/(?:edit|update) (?:task )?(\d+)/i);
    if (match) {
      return {
        intent: 'edit_task',
        params: { taskId: match[1], newText: normalized.replace(/(?:edit|update) (?:task )?\d+/, '').trim() }
      };
    }
  }

  // Default to unknown intent
  return { intent: 'unknown', params: { message: normalized } };
}

// Helper function to parse task details from natural language
function parseTaskDetails(text: string) {
  const params: any = { title: text };

  // Extract due date/time
  const dateRegex = /tomorrow|today|\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?|\d{4}-\d{2}-\d{2}/gi;
  const timeRegex = /\d{1,2}:\d{2}\s*(?:am|pm)?/gi;

  const dateMatch = text.match(dateRegex);
  const timeMatch = text.match(timeRegex);

  if (dateMatch) {
    const dateStr = dateMatch[0];
    let date = new Date();

    if (dateStr === 'today') {
      // Today's date
    } else if (dateStr === 'tomorrow') {
      date.setDate(date.getDate() + 1);
    } else {
      // Parse the date string
      date = new Date(dateStr);
    }

    if (timeMatch) {
      // Add time to the date
      const [hours, minutes] = timeMatch[0].toLowerCase().replace('am', '').replace('pm', '').split(':').map(Number);
      date.setHours(hours, minutes);
    }

    params.due_date = date.toISOString();
    params.title = text.replace(dateMatch[0], '').trim();
  }

  // Extract category
  const categoryMatch = text.match(/\b(work|personal|shopping|health|finance|other)\b/i);
  if (categoryMatch) {
    params.category = categoryMatch[0].toLowerCase();
    params.title = params.title.replace(categoryMatch[0], '').trim();
  }

  // Extract priority
  const priorityMatch = text.match(/\b(high|medium|low)\b/i);
  if (priorityMatch) {
    params.priority = priorityMatch[0].toLowerCase() as 'high' | 'medium' | 'low';
    params.title = params.title.replace(priorityMatch[0], '').trim();
  }

  // Clean up title
  params.title = params.title.replace(/\s+/g, ' ').trim();

  return params;
}

// Handler functions
async function handleAddTask(params: any): Promise<string> {
  try {
    const todoData: TodoCreate = {
      title: params.title || 'New task',
      description: params.description,
      due_date: params.due_date,
      category: params.category,
      priority: params.priority || 'medium',
      reminder: params.reminder,
      position: params.position
    };

    const newTodo = await todoService.createTodo(todoData);

    let response = `Added task: "${newTodo.title}"`;

    if (newTodo.due_date) {
      response += ` due on ${new Date(newTodo.due_date).toLocaleDateString()}`;
    }

    if (newTodo.category) {
      response += ` in category "${newTodo.category}"`;
    }

    if (newTodo.priority) {
      response += ` with ${newTodo.priority} priority`;
    }

    return response;
  } catch (error) {
    console.error('Error adding task:', error);
    return 'Sorry, I could not add that task. Please try again.';
  }
}

async function handleCompleteTask(params: any): Promise<string> {
  try {
    const todos = await todoService.getTodos();

    let targetTodo;

    if (params.taskId) {
      // Find by ID
      targetTodo = todos.find(todo => todo.id === params.taskId);
    } else if (params.taskTitle) {
      // Find by title (fuzzy match)
      targetTodo = todos.find(todo =>
        todo.title.toLowerCase().includes(params.taskTitle.toLowerCase())
      );
    }

    if (!targetTodo) {
      return 'Could not find that task to complete.';
    }

    const updatedTodo = await todoService.toggleTodoComplete(targetTodo.id);

    return `Marked task "${updatedTodo.title}" as completed.`;
  } catch (error) {
    console.error('Error completing task:', error);
    return 'Sorry, I could not complete that task. Please try again.';
  }
}

async function handleListTasks(params: any): Promise<string> {
  try {
    const todos = await todoService.getTodos();
    const incompleteTodos = todos.filter(todo => !todo.is_completed);

    if (incompleteTodos.length === 0) {
      return 'You have no active tasks.';
    }

    const taskList = incompleteTodos.slice(0, 5).map((todo, index) =>
      `${index + 1}. ${todo.title}`
    ).join('\n');

    const remaining = incompleteTodos.length > 5 ? `\n...and ${incompleteTodos.length - 5} more` : '';

    return `You have ${incompleteTodos.length} active tasks:\n${taskList}${remaining}`;
  } catch (error) {
    console.error('Error listing tasks:', error);
    return 'Sorry, I could not retrieve your tasks. Please try again.';
  }
}

async function handleDeleteTask(params: any): Promise<string> {
  try {
    const todos = await todoService.getTodos();

    let targetTodo;

    if (params.taskId) {
      // Find by ID
      targetTodo = todos.find(todo => todo.id === params.taskId);
    } else if (params.taskTitle) {
      // Find by title (fuzzy match)
      targetTodo = todos.find(todo =>
        todo.title.toLowerCase().includes(params.taskTitle.toLowerCase())
      );
    }

    if (!targetTodo) {
      return 'Could not find that task to delete.';
    }

    await todoService.deleteTodo(targetTodo.id);

    return `Deleted task "${targetTodo.title}".`;
  } catch (error) {
    console.error('Error deleting task:', error);
    return 'Sorry, I could not delete that task. Please try again.';
  }
}

async function handleEditTask(params: any): Promise<string> {
  try {
    const todos = await todoService.getTodos();

    let targetTodo;

    if (params.taskId) {
      // Find by ID
      targetTodo = todos.find(todo => todo.id === params.taskId);
    }

    if (!targetTodo) {
      return 'Could not find that task to edit.';
    }

    // For simplicity, we'll just update the title
    const updatedTodo = await todoService.updateTodo(targetTodo.id, {
      title: params.newText || targetTodo.title
    });

    return `Updated task to: "${updatedTodo.title}".`;
  } catch (error) {
    console.error('Error editing task:', error);
    return 'Sorry, I could not edit that task. Please try again.';
  }
}

// Helper function to generate conversation ID
function generateConversationId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}