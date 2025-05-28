'use client';

import type { Task, TaskStatus } from '@/types';
import { TaskColumn } from './task-column';
import { useMemo } from 'react';

interface TaskBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  searchTerm: string;
}

const statuses: TaskStatus[] = ['Todo', 'InProgress', 'Done'];

export function TaskBoard({ tasks, onEditTask, onDeleteTask, onUpdateTaskStatus, searchTerm }: TaskBoardProps) {
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchLower)));
      return matchesSearch;
    });
  }, [tasks, searchTerm]);

  return (
    <div className="flex-grow p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-200px)] md:h-[calc(100vh-150px)]">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter((task) => task.status === status)}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
        ))}
      </div>
    </div>
  );
}
