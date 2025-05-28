'use client';

import type { Task, TaskStatus } from '@/types';
import { TaskCard } from './task-card';
import type React from 'react';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

export function TaskColumn({ status, tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }: TaskColumnProps) {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('taskId');
    if (taskId) {
      onUpdateTaskStatus(taskId, status);
    }
  };

  const getStatusDisplayName = (statusValue: TaskStatus) => {
    switch (statusValue) {
      case 'Todo':
        return 'Pending Intel';
      case 'InProgress':
        return 'Mission Active';
      case 'Done':
        return 'Case Closed';
      default:
        return statusValue.replace(/([A-Z])/g, ' $1').trim();
    }
  };

  return (
    <div
      className="flex-1 px-4 bg-secondary/50 rounded-lg min-w-[300px] h-full overflow-y-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="text-xl py-4 font-semibold mb-4 text-foreground capitalize sticky top-0 bg-card px-2 z-10 border-b-2 border-accent">
        {getStatusDisplayName(status)}
      </h2>
      <div className="space-y-4 pt-2">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No intel here, Commissioner.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))
        )}
      </div>
    </div>
  );
}
