"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { noteFormSchema, NoteFormValues } from "@/lib/types";

interface NoteFormProps {
  defaultValues?: Partial<NoteFormValues>;
  onSubmit: (values: NoteFormValues) => void;
  submitLabel: string;
}

export function NoteForm({ defaultValues, onSubmit, submitLabel }: NoteFormProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: defaultValues || {
      title: "",
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter note title" 
                  {...field} 
                  className="focus-visible:ring-primary/50"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your note content here..." 
                  className="min-h-[180px] resize-none focus-visible:ring-primary/50" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            className="px-6 font-medium"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
