// frontend/src/components/TodoForm.tsx
import { useState } from 'react';
import { TodoCreate } from '@/types';
import { showToast } from '@/lib/toastUtils';

interface TodoFormProps {
  onAddTodo: (todo: TodoCreate) => void;
}

export const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [reminder, setReminder] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    if (reminder && new Date(reminder) < new Date()) {
      newErrors.reminder = 'Reminder time cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    const newTodo: TodoCreate = {
      title,
      description: description.trim() || undefined,
      due_date: dueDate || undefined,
      category: category.trim() || undefined,
      priority,
      reminder: reminder || undefined
    };

    onAddTodo(newTodo);
    showToast('Task added successfully!', 'success');

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setCategory('');
    setPriority('medium');
    setReminder('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`mt-1 block w-full p-2 bg-black border ${
              errors.title ? 'border-red-500' : 'border-[#3c3c3c]'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm`}
            placeholder="What needs to be done?"
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-white">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`mt-1 block w-full p-2 bg-black border ${
              errors.dueDate ? 'border-red-500' : 'border-[#3c3c3c]'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm cursor-pointer`}
            onFocus={(e) => e.currentTarget.showPicker()} // Show picker on focus
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-white">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full p-2 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm"
            placeholder="Work, Personal, etc."
          />
        </div>


        <div className="md:col-span-2">
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
          <label htmlFor="reminder" className="block text-sm font-medium text-white">
            Reminder
          </label>
          <input
            type="datetime-local"
            id="reminder"
            value={reminder}
            onChange={(e) => {
              // Validate datetime-local format (YYYY-MM-DDTHH:mm)
              const selectedDateTime = e.target.value;
              if (selectedDateTime === '' || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(selectedDateTime)) {
                setReminder(selectedDateTime);
              }
            }}
            className={`mt-1 block w-full p-2 bg-black border ${
              errors.reminder ? 'border-red-500' : 'border-[#3c3c3c]'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm cursor-pointer`}
            onFocus={(e) => e.currentTarget.showPicker()} // Show picker on focus
          />
          {errors.reminder && <p className="mt-1 text-sm text-red-500">{errors.reminder}</p>}
        </div>

        <div className="flex items-end">
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