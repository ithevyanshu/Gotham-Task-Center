
'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Task, TaskStatus } from '@/types';
import { Header } from '@/components/header';
import { TaskBoard } from '@/components/task-board';
import { TaskForm } from '@/components/task-form';
import { TaskSummarizationDialog } from '@/components/task-summarization-dialog';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { addDays } from 'date-fns';

// Helper to generate unique IDs
const generateId = () => crypto.randomUUID();

const LOCAL_STORAGE_KEY = 'gothamTasks';

const initialDemoTasks: Omit<Task, 'id'>[] = [
  // Todo Tasks (Pending Intel)
  {
    name: "Investigate Penguin's Smuggling Ring",
    description: "Suspicious activity reported at the docks. Gather intel on Cobblepot's latest operation.",
    priority: 'High',
    status: 'Todo',
    tags: ["investigation", "Penguin", "docks"],
    dueDate: addDays(new Date(), 3),
  },
  {
    name: "Analyze Joker's Laughing Gas Sample",
    description: "New variant of Joker toxin recovered. Identify components and develop antidote.",
    priority: 'High',
    status: 'Todo',
    tags: ["forensics", "Joker", "toxin", "lab"],
    dueDate: addDays(new Date(), 5),
  },
  // InProgress Tasks (Mission Active)
  {
    name: "Repair Batmobile",
    description: "Minor damage sustained during last patrol. Needs new tires and armor reinforcement.",
    priority: 'Medium',
    status: 'InProgress',
    tags: ["maintenance", "Batmobile", "vehicle"],
    dueDate: addDays(new Date(), 1),
  },
  {
    name: "Tail Two-Face's Goons",
    description: "Observe movements of Two-Face's crew near the old Janus Cosmetics building.",
    priority: 'Medium',
    status: 'InProgress',
    tags: ["surveillance", "Two-Face", "Janus"],
    dueDate: addDays(new Date(), 0), // Due today
  },
  // Done Tasks (Case Closed)
  {
    name: "Meet with Commissioner Gordon",
    description: "Discussed recent spike in organized crime and coordinated GCPD efforts.",
    priority: 'Medium',
    status: 'Done',
    tags: ["meeting", "GCPD", "Gordon"],
    dueDate: addDays(new Date(), -2),
  },
  {
    name: "Apprehend Catwoman (Attempt #3)",
    description: "Successfully recovered the stolen diamond from Selina Kyle. She slipped away... again.",
    priority: 'Low',
    status: 'Done',
    tags: ["apprehension", "Catwoman", "theft", "recovery"],
    dueDate: addDays(new Date(), -1),
  }
];


export default function TaskPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    setIsLoadingTasks(true);
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({ // Use 'any' temporarily for parsing flexibility
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(parsedTasks as Task[]);
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
        // If parsing fails, load demo tasks
        setTasks(initialDemoTasks.map(task => ({ ...task, id: generateId() })));
      }
    } else {
      // Seed with demo data if localStorage is empty
      setTasks(initialDemoTasks.map(task => ({ ...task, id: generateId() })));
    }
    // Simulate a short delay for loading, similar to a backend fetch
    setTimeout(() => setIsLoadingTasks(false), 500);
  }, []);

  // Save tasks to localStorage whenever they change, but not during initial load
  useEffect(() => {
    if (!isLoadingTasks) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoadingTasks]);


  const handleOpenTaskForm = (task?: Task) => {
    setTaskToEdit(task || null);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setTaskToEdit(null);
  };

  const handleTaskSubmit = (taskDataFromForm: Omit<Task, 'id'> | Task, isEditing: boolean) => {
    if (isEditing && 'id' in taskDataFromForm) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskDataFromForm.id ? { ...task, ...taskDataFromForm, dueDate: taskDataFromForm.dueDate ? new Date(taskDataFromForm.dueDate) : undefined } : task
        )
      );
      toast({ title: "Task Updated", description: `"${taskDataFromForm.name}" has been updated.` });
    } else {
      const newTask: Task = {
        ...taskDataFromForm,
        id: generateId(),
        dueDate: taskDataFromForm.dueDate ? new Date(taskDataFromForm.dueDate) : undefined
      } as Task; // Ensure ID and correctly typed dueDate
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast({ title: "Task Created", description: `"${newTask.name}" has been added.` });
    }
    handleCloseTaskForm();
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    if (taskToDelete) {
      toast({ title: "Task Deleted", description: `"${taskToDelete.name}" has been deleted.`, variant: "destructive" });
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
    // Optional: toast for status update if desired
  };

  const handleOpenSummaryDialog = () => {
    setIsSummaryDialogOpen(true);
  };

  const handleCloseSummaryDialog = () => {
    setIsSummaryDialogOpen(false);
  };
  
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background text-foreground">
          <Header
            onSearch={setSearchTerm}
            onAddTask={() => handleOpenTaskForm()}
            onSummarizeTasks={handleOpenSummaryDialog}
          />
          {isLoadingTasks ? ( 
            <div className="flex-grow p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <TaskBoard
              tasks={tasks}
              onEditTask={handleOpenTaskForm}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              searchTerm={searchTerm}
            />
          )}
          <TaskForm
            isOpen={isTaskFormOpen}
            onClose={handleCloseTaskForm}
            onSubmit={handleTaskSubmit}
            taskToEdit={taskToEdit}
            isSubmitting={false} // No server submission in this version
          />
          <TaskSummarizationDialog
            isOpen={isSummaryDialogOpen}
            onClose={handleCloseSummaryDialog}
            tasks={tasks.filter(task => task.status !== 'Done')} 
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
