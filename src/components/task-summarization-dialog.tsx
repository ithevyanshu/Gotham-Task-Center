'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { summarizeOpenTasks, type SummarizeOpenTasksInput } from '@/ai/flows/summarize-open-tasks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface TaskSummarizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

export function TaskSummarizationDialog({ isOpen, onClose, tasks }: TaskSummarizationDialogProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchSummary = async () => {
        setIsLoading(true);
        setError(null);
        setSummary(null);

        const openTasks = tasks.filter(task => task.status !== 'Done');
        if (openTasks.length === 0) {
          setSummary("No open tasks to summarize.");
          setIsLoading(false);
          return;
        }

        const input: SummarizeOpenTasksInput = {
          openTasks: openTasks.map(task => ({
            name: task.name,
            description: task.description || 'No description',
          })),
        };

        try {
          const result = await summarizeOpenTasks(input);
          setSummary(result.summary);
        } catch (e) {
          console.error("Error summarizing tasks:", e);
          setError("Failed to generate task summary. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSummary();
    }
  }, [isOpen, tasks]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Open Tasks Summary</DialogTitle>
          <DialogDescription>
            An AI-generated summary of your tasks that are not yet completed.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          {isLoading && (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </>
          )}
          {error && (
             <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {summary && !isLoading && (
            <p className="text-sm text-foreground whitespace-pre-wrap">{summary}</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
