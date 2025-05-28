'use client';

import type { Task } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileEdit, Trash2, CalendarDays, Circle, CircleDotDashed, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { PriorityIcon } from '@/components/icons';
import type React from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const StatusIcon = ({ status }: { status: Task['status']}) => {
    switch (status) {
      case 'Todo': return <Circle className="h-4 w-4 text-muted-foreground" />;
      case 'InProgress': return <CircleDotDashed className="h-4 w-4 text-accent" />; 
      case 'Done': return <CheckCircle2 className="h-4 w-4 text-foreground/70" />; 
      default: return null;
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('taskId', task.id);
    // Add a class to the dragged element for visual feedback
    event.currentTarget.classList.add('is-dragging');
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    // Remove the visual feedback class
    event.currentTarget.classList.remove('is-dragging');
  };
  
  return (
    <Card 
      className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 bg-card cursor-grab"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-card-foreground">{task.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Edit task">
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task" className="text-destructive hover:text-destructive/90">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {task.description && (
          <CardDescription className="text-sm text-muted-foreground pt-1">{task.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <StatusIcon status={task.status} />
          <span className="ml-2">{task.status}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <PriorityIcon priority={task.priority} />
          <span className="ml-2">{task.priority} Priority</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span className="ml-2">Due: {format(new Date(task.dueDate), 'PPP')}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
