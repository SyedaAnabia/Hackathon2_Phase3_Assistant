// frontend/src/components/TodoList.tsx

import { useState, useEffect } from 'react';
import { Todo } from '@/types';
import TodoItem from './TodoItem';
import { reorder } from '@/lib/dragUtils';

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
  onDeleteTodo: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onReorder: (reorderedTodos: Todo[]) => void;
}

export const TodoList = ({
  todos,
  onUpdateTodo,
  onDeleteTodo,
  onToggleComplete,
  onReorder
}: TodoListProps) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);

  // Sort todos by position, ensuring position is defined
  const sortedTodos = [...todos].map(todo => ({
    ...todo,
    position: todo.position ?? 0
  })).sort((a, b) => a.position - b.position);

  if (sortedTodos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white">No todos yet. Add one above!</p>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedItem(index);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    setDragOverItem(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetIndex: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));

    if (draggedIndex !== targetIndex) {
      const reordered = reorder(sortedTodos, draggedIndex, targetIndex);
      onReorder(reordered);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <ul className="divide-y divide-gray-200">
      {sortedTodos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdateTodo}
          onDelete={onDeleteTodo}
          onToggleComplete={onToggleComplete}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          isDragging={draggedItem === index}
          isDragOver={dragOverItem === index}
          index={index}
        />
      ))}
    </ul>
  );
};