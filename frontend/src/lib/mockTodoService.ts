// frontend/src/lib/mockTodoService.ts

// Mock service functions for todo operations
export const mockTodoService = {
  // Get all todos for the authenticated user
  getTodos: async (): Promise<any[]> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get todos from localStorage
      const todos = JSON.parse(localStorage.getItem('mock_todos') || '[]');
      return todos;
    } catch (error) {
      console.error('Error fetching mock todos:', error);
      throw error;
    }
  },

  // Create a new todo
  createTodo: async (todoData: { title: string; description?: string }): Promise<any> => {
    try {
      console.log('Mock service creating todo with data:', todoData); // Debug log

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get existing todos from localStorage
      const todos = JSON.parse(localStorage.getItem('mock_todos') || '[]');
      console.log('Current todos in storage:', todos); // Debug log

      // Create new todo with unique ID
      const newTodo = {
        id: Math.random().toString(36).substr(2, 9),
        title: todoData.title,
        description: todoData.description,
        is_completed: false,
        user_id: localStorage.getItem('user_email') || 'mock_user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('New todo being created:', newTodo); // Debug log

      // Add new todo to the list
      todos.unshift(newTodo);

      // Save updated todos to localStorage
      localStorage.setItem('mock_todos', JSON.stringify(todos));
      console.log('Todos saved to localStorage:', JSON.parse(localStorage.getItem('mock_todos') || '[]')); // Debug log

      return newTodo;
    } catch (error) {
      console.error('Error creating mock todo:', error);
      throw error;
    }
  },

  // Get a specific todo
  getTodo: async (todoId: string): Promise<any> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get todos from localStorage
      const todos = JSON.parse(localStorage.getItem('mock_todos') || '[]');

      // Find the todo with the specified ID
      const todo = todos.find((t: any) => t.id === todoId);

      if (!todo) {
        throw new Error('Todo not found');
      }

      return todo;
    } catch (error) {
      console.error(`Error fetching mock todo with id ${todoId}:`, error);
      throw error;
    }
  },

  // Update a specific todo
  updateTodo: async (todoId: string, todoData: any): Promise<any> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      // Get existing todos from localStorage
      const todos = JSON.parse(localStorage.getItem('mock_todos') || '[]');

      // Find the index of the todo with the specified ID
      const todoIndex = todos.findIndex((t: any) => t.id === todoId);

      if (todoIndex === -1) {
        throw new Error('Todo not found');
      }

      // Update the todo
      const updatedTodo = {
        ...todos[todoIndex],
        ...todoData,
        updated_at: new Date().toISOString()
      };

      // Update the todo in the list
      todos[todoIndex] = updatedTodo;

      // Save updated todos to localStorage
      localStorage.setItem('mock_todos', JSON.stringify(todos));

      return updatedTodo;
    } catch (error) {
      console.error(`Error updating mock todo with id ${todoId}:`, error);
      throw error;
    }
  },

  // Toggle completion status of a todo
  toggleTodoComplete: async (todoId: string): Promise<any> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get existing todos from localStorage
      const todos = JSON.parse(localStorage.getItem('mock_todos') || '[]');

      // Find the index of the todo with the specified ID
      const todoIndex = todos.findIndex((t: any) => t.id === todoId);

      if (todoIndex === -1) {
        throw new Error('Todo not found');
      }

      // Toggle the completion status
      const updatedTodo = {
        ...todos[todoIndex],
        is_completed: !todos[todoIndex].is_completed,
        updated_at: new Date().toISOString()
      };

      // Update the todo in the list
      todos[todoIndex] = updatedTodo;

      // Save updated todos to localStorage
      localStorage.setItem('mock_todos', JSON.stringify(todos));

      return updatedTodo;
    } catch (error) {
      console.error(`Error toggling mock todo completion with id ${todoId}:`, error);
      throw error;
    }
  },

  // Delete a specific todo
  deleteTodo: async (todoId: string): Promise<void> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get existing todos from localStorage
      let todos = JSON.parse(localStorage.getItem('mock_todos') || '[]');

      // Filter out the todo with the specified ID
      todos = todos.filter((t: any) => t.id !== todoId);

      // Save updated todos to localStorage
      localStorage.setItem('mock_todos', JSON.stringify(todos));
    } catch (error) {
      console.error(`Error deleting mock todo with id ${todoId}:`, error);
      throw error;
    }
  },
};