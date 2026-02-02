// frontend/src/components/TodoForm.tsx
import { useState } from 'react';

interface TodoFormProps {
  onAddTodo: (title: string, description?: string) => void;
}

export const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTodo(title, description.trim() || undefined);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm"
            placeholder="What needs to be done?"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm"
            placeholder="Additional details (optional)"
            rows={2}
          />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-[#3c3c3c] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
          >
            Add Task
           </button>
        </div>
      </div>
    </form>
  );
};