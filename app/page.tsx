"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { NoteCard } from "./components/NoteCard";
import { CreateNoteDialog } from "./components/CreateNoteDialog";
import { EditNoteDialog } from "./components/EditNoteDialog";
import { Note, NoteFormValues } from "@/lib/types";
import { fetchNotes, createNote, updateNote, deleteNote } from "@/lib/notesApi";

export default function Home() {
  // State for notes
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load notes on component mount
  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const fetchedNotes = await fetchNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        toast.error("Failed to load notes");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotes();
  }, []);

  // Create a new note
  const handleCreateNote = async (values: NoteFormValues) => {
    try {
      const newNote = await createNote(values);
      setNotes([newNote, ...notes]);
      toast.success("Note created successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create note");
    }
  };

  // Update an existing note
  const handleUpdateNote = async (values: NoteFormValues) => {
    if (!currentNote) return;

    try {
      const updatedNote = await updateNote(currentNote.id, values);
      
      const updatedNotes = notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );

      setNotes(updatedNotes);
      setCurrentNote(null);
      toast.success("Note updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update note");
    }
  };

  // Delete a note
  const handleDeleteNote = async (id: number) => {
    // Store current notes for potential rollback
    const previousNotes = [...notes];
    
    try {
      // Optimistically update UI
      setNotes(notes.filter(note => note.id !== id));
      
      await deleteNote(id);
      toast.success("Note deleted successfully!");
    } catch (error) {
      // Restore previous state on error
      setNotes(previousNotes);
      toast.error(error instanceof Error ? error.message : "Failed to delete note");
    }
  };

  // Open the edit dialog and populate form with note data
  const openEditDialog = (note: Note) => {
    setCurrentNote(note);
    setIsEditOpen(true);
  };

  return (
    <div className="bg-gradient-to-b from-background to-muted/20 pb-8">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-foreground/90 tracking-tight">My Notes</h1>
          <CreateNoteDialog onCreateNote={handleCreateNote} />
        </div>

        {/* Edit Note Dialog */}
        <EditNoteDialog 
          open={isEditOpen} 
          onOpenChange={setIsEditOpen} 
          note={currentNote} 
          onUpdateNote={handleUpdateNote} 
        />

        {/* Notes Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-lg border border-border/50">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-medium mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-6">Create your first note to get started!</p>
            <CreateNoteDialog onCreateNote={handleCreateNote} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onEdit={openEditDialog} 
                onDelete={handleDeleteNote} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
