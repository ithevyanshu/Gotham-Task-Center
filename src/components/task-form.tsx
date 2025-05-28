'use client';

import type { Task, Priority, TaskStatus } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const priorities: Priority[] = ['Low', 'Medium', 'High'];
const statuses: TaskStatus[] = ['Todo', 'InProgress', 'Done'];

// Schema for the form data
const taskFormSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  priority: z.enum(priorities),
  status: z.enum(statuses),
  tags: z.string().optional().transform(value => value ? value.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
});

type TaskFormData = z.infer<typeof taskFormSchema>;
export type NewTaskFormData = Omit<TaskFormData, 'id'>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewTaskFormData | Task, isEditing: boolean) => void;
  taskToEdit?: Task | null;
  isSubmitting?: boolean;
}

export function TaskForm({ isOpen, onClose, onSubmit, taskToEdit, isSubmitting }: TaskFormProps) {

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: '',
      description: '',
      dueDate: null,
      priority: 'Medium',
      status: 'Todo',
      tags: [],
    },
  });

  useEffect(() => {
    if (isOpen && taskToEdit) {
      form.reset({
        name: taskToEdit.name,
        description: taskToEdit.description || '',
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : null,
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        tags: taskToEdit.tags || [],
      });
    } else if (isOpen && !taskToEdit) {
      form.reset({
        name: '',
        description: '',
        dueDate: null,
        priority: 'Medium',
        status: 'Todo',
        tags: [],
      });
    }
  }, [taskToEdit, form, isOpen]);

  const handleSubmit = (data: TaskFormData) => {
    if (taskToEdit) {
      const completeTaskData: Task = {
        id: taskToEdit.id,
        ...data,
        dueDate: data.dueDate || undefined,
        tags: data.tags || [],
      };
      onSubmit(completeTaskData, true);
    } else {
      const newTaskData: NewTaskFormData = {
        ...data,
        dueDate: data.dueDate || undefined,
        tags: data.tags || [],
      };
      onSubmit(newTaskData, false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[525px] bg-card">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter task description (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <div className="flex gap-2">
                    {/* Fallback to native date input if popover issues persist */}
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null;
                          field.onChange(date);
                        }}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="flex-1"
                      />
                    </FormControl>
                    {field.value && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange(null)}
                        className=""
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., intel, surveillance, mission"
                      value={Array.isArray(value) ? value.join(', ') : (value || '')}
                      onChange={(e) => onChange(e.target.value)}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? (taskToEdit ? 'Saving...' : 'Creating...') : (taskToEdit ? 'Save Changes' : 'Create Task')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}