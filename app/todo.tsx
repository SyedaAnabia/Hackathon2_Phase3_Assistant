"use client";

import { useState, useEffect } from 'react';
import { todoServiceToUse as todoService } from '@/lib/todoServiceSelector';
import { Todo } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout, isAuthenticated } = useAuth();

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const fetchedTodos = await todoService.getTodos();
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('Failed to load todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (title.trim()) {
      try {
        const newTodoData = {
          title: title.trim(),
          description: description.trim() || undefined,
        };

        console.log('Creating todo with data:', newTodoData); // Debug log

        const newTodo = await todoService.createTodo(newTodoData);
        console.log('Created todo:', newTodo); // Debug log

        setTodos([newTodo, ...todos]); // Add new todo to the top
        setTitle('');
        setDescription('');
      } catch (err) {
        console.error('Error adding todo:', err);
        setError('Failed to add task. Please try again.');
      }
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const updatedTodo = await todoService.toggleTodoComplete(id);
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError('Failed to update todo. Please try again.');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Todo App</h1>
              <p className="text-gray-600">Manage your tasks efficiently</p>
            </div>
            <div className="text-center py-8">
              <p>Loading todos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated before showing content
  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Redirecting to login...</div>;
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-black shadow-sm py-4 px-6 flex justify-between items-center border-b border-[#3c3c3c]">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Todo App</span>
        </Link>
        <div className="flex space-x-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-md bg-black hover:bg-[#3c3c3c] text-white font-medium border border-white"
          >
            My Tasks
          </Link>
          <button
            onClick={() => {
              logout();
            }}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors border border-white"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-black rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
              <p className="text-white">Manage your tasks efficiently</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900 text-white rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What needs to be done?"
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional details (optional)"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <button
                    onClick={addTodo}
                    className="w-full bg-black hover:bg-[#3c3c3c] text-white font-semibold py-3 px-6 rounded-lg transition duration-200 border border-white"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {todos.length === 0 ? (
                <p className="text-white text-center py-4">No tasks yet. Add your first task!</p>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex justify-between items-start p-4 rounded-lg border ${
                      todo.is_completed
                        ? 'bg-black border-gray-200'
                        : 'bg-black border-gray-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={todo.is_completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="mt-1 h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="ml-3 min-w-0 flex-1">
                        <div
                          className={`font-bold text-lg ${todo.is_completed ? 'line-through text-white' : 'text-white'}`}
                        >
                          {todo.title || 'No title'}

                        </div>
                        {todo.description && (
                          <div
                            className={`mt-1 text-sm ${todo.is_completed ? 'line-through text-white' : 'text-white'}`}
                          >
                            {todo.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-white hover:text-white font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}