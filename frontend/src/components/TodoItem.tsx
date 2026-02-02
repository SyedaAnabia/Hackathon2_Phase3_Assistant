// frontend/src/components/TodoItem.tsx

import { useState } from 'react';
import { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete, onToggleComplete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onToggleComplete(todo.id);
  };

  return (
    <li className="py-4 flex items-center justify-between">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={handleToggleComplete}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <div className="ml-3 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="block w-full px-3 py-2 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="block w-full px-3 py-2 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm"
                rows={2}
              />
              <div className="flex space-x-2 mt-1">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-2.5 py-1.5 border border-white text-xs font-medium rounded text-white bg-black hover:bg-[#3c3c3c] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-2.5 py-1.5 border border-[#3c3c3c] text-xs font-medium rounded text-white bg-black hover:bg-[#3c3c3c] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className={`${todo.is_completed ? 'line-through text-white' : 'text-white'} text-sm font-medium`}>
                {todo.title}
              </p>
              {todo.description && (
                <p className={`${todo.is_completed ? 'line-through text-white' : 'text-white'} text-sm`}>
                  {todo.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-2.5 py-1.5 border border-white text-xs font-medium rounded text-white bg-black hover:bg-[#3c3c3c] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="inline-flex items-center px-2.5 py-1.5 border border-white text-xs font-medium rounded text-white bg-black hover:bg-[#3c3c3c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BB86FC]"
        >
          Delete
        </button>
      </div>
    </li>
  );
}