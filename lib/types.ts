import { z } from "zod";

// Define the Note type
export type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

// Define the form schema
export const noteFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
