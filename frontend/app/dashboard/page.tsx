'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TodoList } from '@/components/TodoList';
import { TodoForm } from '@/components/TodoForm';
import { Todo } from '@/types';
import { todoServiceToUse as todoService } from '@/lib/todoServiceSelector';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [error, setError] = useState<string | null>(null);

  // Load todos on component mount
  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    try {
      const fetchedTodos = await todoService.getTodos();
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('Failed to load todos. Please try again later.');
    }
  };

  // Filter todos based on selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.is_completed;
    if (filter === 'completed') return todo.is_completed;
    return true; // 'all' filter
  });

  const handleAddTodo = async (title: string, description?: string) => {
    if (!user) return;

    try {
      const newTodoData = {
        title,
        description
      };

      const newTodo = await todoService.createTodo(newTodoData);
      setTodos([newTodo, ...todos]); // Add new todo to the top
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add task. Please try again.');
    }
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, updates);
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
    }
  };

  const handleToggleComplete = async (id: string) => {
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

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <>
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
            className="px-4 py-2 rounded-lg bg-black text-[#BB86FC] font-medium border border-[#3c3c3c]"
          >
            My Tasks
          </Link>
          <button
            onClick={logout}
            className="ml-4 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-[#3c3c3c] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]/50 transition-all shadow-lg shadow-[#BB86FC]/20 border border-white"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-black shadow-xl rounded-2xl p-6 border border-[#3c3c3c]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">My Tasks</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm rounded-xl transition-all border border-white ${
                    filter === 'all' ? 'bg-black text-white' : 'bg-black text-white hover:bg-[#3c3c3c]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 text-sm rounded-xl transition-all border border-white ${
                    filter === 'active' ? 'bg-black text-white' : 'bg-black text-white hover:bg-[#3c3c3c]'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 text-sm rounded-xl transition-all border border-white ${
                    filter === 'completed' ? 'bg-black text-white' : 'bg-black text-white hover:bg-[#3c3c3c]'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 text-white rounded-lg">
                {error}
              </div>
            )}

            <TodoForm onAddTodo={handleAddTodo} />

            <div className="mt-6">
              <TodoList
                todos={filteredTodos}
                onUpdateTodo={handleUpdateTodo}
                onDeleteTodo={handleDeleteTodo}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}