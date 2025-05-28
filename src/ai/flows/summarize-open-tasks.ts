'use server';

/**
 * @fileOverview Summarizes all open tasks for a user.
 *
 * - summarizeOpenTasks - A function that summarizes open tasks.
 * - SummarizeOpenTasksInput - The input type for the summarizeOpenTasks function.
 * - SummarizeOpenTasksOutput - The return type for the summarizeOpenTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeOpenTasksInputSchema = z.object({
  openTasks: z.array(
    z.object({
      name: z.string().describe('The name of the task.'),
      description: z.string().describe('The description of the task.'),
    })
  ).describe('A list of open tasks to summarize.'),
});
export type SummarizeOpenTasksInput = z.infer<typeof SummarizeOpenTasksInputSchema>;

const SummarizeOpenTasksOutputSchema = z.object({
  summary: z.string().describe('A summary of all open tasks.'),
});
export type SummarizeOpenTasksOutput = z.infer<typeof SummarizeOpenTasksOutputSchema>;

export async function summarizeOpenTasks(input: SummarizeOpenTasksInput): Promise<SummarizeOpenTasksOutput> {
  return summarizeOpenTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeOpenTasksPrompt',
  input: {schema: SummarizeOpenTasksInputSchema},
  output: {schema: SummarizeOpenTasksOutputSchema},
  prompt: `You are a task management assistant.  Please summarize the following list of open tasks, so that the user can quickly understand what's important.

Open Tasks:
{{#each openTasks}}
- {{name}}: {{description}}
{{/each}}
`,
});

const summarizeOpenTasksFlow = ai.defineFlow(
  {
    name: 'summarizeOpenTasksFlow',
    inputSchema: SummarizeOpenTasksInputSchema,
    outputSchema: SummarizeOpenTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
