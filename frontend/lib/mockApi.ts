// frontend/lib/mockApi.ts
// Mock API implementation for GitHub Pages deployment

// Mock data storage
let mockTodos: any[] = [
  { id: '1', title: 'Sample Todo', description: 'This is a sample todo item', is_completed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', title: 'Another Todo', description: 'This is another sample todo item', is_completed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTodoAPI = {
  // Get all todos for the authenticated user
  getTodos: async () => {
    await delay(500); // Simulate network delay
    return { data: mockTodos };
  },

  // Create a new todo
  createTodo: async (todoData: any) => {
    await delay(500); // Simulate network delay
    const newTodo = {
      id: (mockTodos.length + 1).toString(),
      ...todoData,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockTodos.push(newTodo);
    return { data: newTodo };
  },

  // Get a specific todo
  getTodo: async (todoId: string) => {
    await delay(500); // Simulate network delay
    const todo = mockTodos.find(t => t.id === todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return { data: todo };
  },

  // Update a specific todo
  updateTodo: async (todoId: string, todoData: any) => {
    await delay(500); // Simulate network delay
    const index = mockTodos.findIndex(t => t.id === todoId);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    mockTodos[index] = { ...mockTodos[index], ...todoData, updated_at: new Date().toISOString() };
    return { data: mockTodos[index] };
  },

  // Toggle completion status of a todo
  toggleTodoComplete: async (todoId: string) => {
    await delay(500); // Simulate network delay
    const index = mockTodos.findIndex(t => t.id === todoId);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    mockTodos[index] = { ...mockTodos[index], is_completed: !mockTodos[index].is_completed, updated_at: new Date().toISOString() };
    return { data: mockTodos[index] };
  },

  // Delete a specific todo
  deleteTodo: async (todoId: string) => {
    await delay(500); // Simulate network delay
    const index = mockTodos.findIndex(t => t.id === todoId);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    mockTodos.splice(index, 1);
  },
};

export const mockAuthAPI = {
  login: async (email: string, password: string) => {
    await delay(500); // Simulate network delay
    if (email && password) {
      return { data: { access_token: 'mock_token', user: { email } } };
    }
    throw new Error('Invalid credentials');
  },

  signup: async (email: string, password: string) => {
    await delay(500); // Simulate network delay
    if (email && password) {
      return { data: { access_token: 'mock_token', user: { email } } };
    }
    throw new Error('Signup failed');
  },
};