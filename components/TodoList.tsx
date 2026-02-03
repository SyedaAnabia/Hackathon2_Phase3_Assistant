'use client';

import React from 'react';
import { Todo } from '@/types';

interface TodoListProps {
  todos: Todo[];
  onUpdateTodos?: (updatedTodos: Todo[]) => void;
  onUpdateTodo?: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDeleteTodo?: (id: string) => Promise<void>;
  onToggleComplete?: (id: string) => Promise<void>;
  onReorder?: (reorderedTodos: Todo[]) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onUpdateTodos,
  onUpdateTodo,
  onDeleteTodo,
  onToggleComplete,
  onReorder
}) => {
  return (
    <div className="todo-list">
      <h2>My Tasks</h2>
      <div className="todos">
        {todos.length === 0 ? (
          <p>No tasks yet. Add one!</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className="todo-item">
              <span>{todo.title}</span>
              <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => {}}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;