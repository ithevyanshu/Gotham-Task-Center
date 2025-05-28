'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Brain } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { CalendarIcon } from 'lucide-react';
// import { format } from 'date-fns';
// import type { Priority, TaskStatus } from '@/types';

// const priorities: Priority[] = ['Low', 'Medium', 'High'];
// const statuses: TaskStatus[] = ['Todo', 'InProgress', 'Done'];

interface HeaderProps {
  onSearch: (term: string) => void;
  // onFilterChange: (filters: { priority?: Priority | 'all'; status?: TaskStatus | 'all'; dueDate?: Date | null }) => void;
  onAddTask: () => void;
  onSummarizeTasks: () => void;
  // currentFilters: { priority: Priority | 'all'; status: TaskStatus | 'all'; dueDate: Date | null };
}

export function Header({ onSearch, onAddTask, onSummarizeTasks }: HeaderProps) {
  // const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>(currentFilters.priority);
  // const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>(currentFilters.status);
  // const [dateFilter, setDateFilter] = useState<Date | null>(currentFilters.dueDate);

  // useEffect(() => {
  //   onFilterChange({ priority: priorityFilter, status: statusFilter, dueDate: dateFilter });
  // }, [priorityFilter, statusFilter, dateFilter, onFilterChange]);

  return (
    <header className="bg-card shadow-sm p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-accent">Gotham Task Control</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks"
              className="pl-10 w-full"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Filter controls - simplified for now, can be expanded later */}
          {/* 
          <Select value={priorityFilter} onValueChange={(value: Priority | 'all') => setPriorityFilter(value)}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value: TaskStatus | 'all') => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "PPP") : <span>Due Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateFilter || undefined} onSelect={(d) => setDateFilter(d || null)} initialFocus />
            </PopoverContent>
          </Popover>
          */}
        </div>

        <div className="flex items-center gap-2">
           <Button onClick={onSummarizeTasks} variant="outline" className="text-accent-foreground bg-accent hover:bg-accent/90 border-accent">
            <Brain className="h-4 w-4" />
            Summary
          </Button>
          <Button onClick={onAddTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
    </header>
  );
}
