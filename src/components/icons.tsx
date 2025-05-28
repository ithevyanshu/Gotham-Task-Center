import type { SVGProps } from 'react';
import { Flag } from 'lucide-react';
import type { Priority } from '@/types';

export function PriorityIcon({ priority, className }: { priority: Priority, className?: string }) {
  // Batman theme adjustments:
  // Low: Muted grey
  // Medium: Dimmer accent (yellow/gold)
  // High: Full accent (yellow/gold)
  const colorMap: Record<Priority, string> = {
    Low: 'text-muted-foreground', // Use muted-foreground for low priority
    Medium: 'text-accent/70', // Use accent color with 70% opacity
    High: 'text-accent', // Use full accent color
  };
  return <Flag className={`${className || 'h-4 w-4'} ${colorMap[priority]}`} />;
}

// Placeholder for other custom icons if needed
