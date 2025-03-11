"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteForm } from "./NoteForm";
import { Note, NoteFormValues } from "@/lib/types";
import { PencilIcon } from "lucide-react";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note | null;
  onUpdateNote: (values: NoteFormValues) => void;
}

export function EditNoteDialog({ open, onOpenChange, note, onUpdateNote }: EditNoteDialogProps) {
  const handleSubmit = (values: NoteFormValues) => {
    onUpdateNote(values);
    onOpenChange(false);
  };

  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl flex items-center gap-2">
            <PencilIcon size={18} className="text-muted-foreground" />
            Edit note
          </DialogTitle>
          <DialogDescription>
            Make changes to your note. Click update when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <NoteForm 
          defaultValues={{ 
            title: note.title, 
            content: note.content 
          }} 
          onSubmit={handleSubmit} 
          submitLabel="Update Note" 
        />
      </DialogContent>
    </Dialog>
  );
}
