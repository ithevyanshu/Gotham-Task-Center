export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'InProgress' | 'Done';

export interface Task {
  id: string;
  name: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  status: TaskStatus;
  tags?: string[];
}
