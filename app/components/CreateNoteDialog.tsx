"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NoteForm } from "./NoteForm";
import { NoteFormValues } from "@/lib/types";
import { PlusIcon } from "lucide-react";

interface CreateNoteDialogProps {
  onCreateNote: (values: NoteFormValues) => void;
}

export function CreateNoteDialog({ onCreateNote }: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (values: NoteFormValues) => {
    onCreateNote(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 px-4 font-medium">
          <PlusIcon size={16} />
          Create Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">Create a new note</DialogTitle>
          <DialogDescription>
            Add a title and content for your note. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <NoteForm onSubmit={handleSubmit} submitLabel="Save Note" />
      </DialogContent>
    </Dialog>
  );
}
