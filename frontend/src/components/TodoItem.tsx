// frontend/src/components/TodoItem.tsx

import { useState } from 'react';
import { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
  onDrop?: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  index?: number;
}

export default function TodoItem({
  todo,
  onUpdate,
  onDelete,
  onToggleComplete,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging = false,
  isDragOver = false,
  index = 0
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editDueDate, setEditDueDate] = useState(todo.due_date || '');
  const [editCategory, setEditCategory] = useState(todo.category || '');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>(todo.priority || 'medium');
  const [editReminder, setEditReminder] = useState(todo.reminder || '');

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription || undefined,
      due_date: editDueDate || undefined,
      category: editCategory || undefined,
      priority: editPriority,
      reminder: editReminder || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.due_date || '');
    setEditCategory(todo.category || '');
    setEditPriority(todo.priority || 'medium');
    setEditReminder(todo.reminder || '');
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onToggleComplete(todo.id);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format datetime for display
  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  // Get priority color
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-white';
    }
  };

  return (
    <li
      className={`py-4 flex items-start justify-between transition-all duration-200 ${
        isDragging ? 'opacity-50 bg-[#1f1b24]' :
        isDragOver ? 'bg-[#1f1b24] border-l-4 border-[#BB86FC]' : ''
      }`}
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, index || 0)}
      onDragOver={(e) => onDragOver?.(e, index || 0)}
      onDrop={(e) => onDrop?.(e, index || 0)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={handleToggleComplete}
          className="h-4 w-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <div className="ml-3 min-w-0">
          {isEditing ? (
            <div className="space-y-2 w-full max-w-md">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="block w-full px-3 py-2 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm"
                autoFocus
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Due Date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="block w-full px-2 py-1 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="block w-full px-2 py-1 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Category</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="block w-full px-2 py-1 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white text-sm"
                    placeholder="Category"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Reminder</label>
                  <input
                    type="datetime-local"
                    value={editReminder}
                    onChange={(e) => setEditReminder(e.target.value)}
                    className="block w-full px-2 py-1 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white text-sm"
                  />
                </div>
              </div>

              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="block w-full px-3 py-2 bg-black border border-[#3c3c3c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white sm:text-sm"
                rows={2}
                placeholder="Description"
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
            <div className="w-full">
              <div className="flex items-baseline gap-2">
                <p className={`${todo.is_completed ? 'line-through text-gray-500' : 'text-white'} text-sm font-medium`}>
                  {todo.title}
                </p>
                {todo.priority && (
                  <span className={`text-xs ${getPriorityColor(todo.priority)} font-semibold uppercase`}>
                    {todo.priority}
                  </span>
                )}
              </div>

              {todo.description && (
                <p className={`${todo.is_completed ? 'line-through text-gray-500' : 'text-white'} text-sm mt-1`}>
                  {todo.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-1">
                {todo.due_date && (
                  <span className="text-xs bg-[#1f1b24] text-white px-2 py-1 rounded">
                    Due: {formatDate(todo.due_date)}
                  </span>
                )}

                {todo.category && (
                  <span className="text-xs bg-[#1f1b24] text-[#BB86FC] px-2 py-1 rounded">
                    #{todo.category}
                  </span>
                )}

                {todo.reminder && (
                  <span className="text-xs bg-[#1f1b24] text-yellow-400 px-2 py-1 rounded">
                    Reminder: {formatDateTime(todo.reminder)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        {!isEditing && draggable && (
          <div className="cursor-move flex items-center justify-center w-8 h-8 rounded-md bg-[#1f1b24] text-gray-400 hover:bg-[#3c3c3c]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        )}
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