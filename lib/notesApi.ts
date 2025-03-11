import { Note, NoteFormValues } from "./types";

/**
 * Fetch all notes from the API
 */
export const fetchNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetch("/api/notes");
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch notes");
    }
    
    const notes = await response.json();
    
    // Transform the data to match the expected format
    return notes.map((note: {
      id: number;
      title: string;
      content?: string;
      text?: string;
      createdAt: string;
      updatedAt: string;
    }): Note => ({
      id: note.id,
      title: note.title,
      content: note.content || note.text || "", // Handle both field names for backward compatibility
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt)
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

/**
 * Create a new note
 */
export const createNote = async (noteData: NoteFormValues): Promise<Note> => {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: noteData.title,
        content: noteData.content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create note');
    }

    const newNote = await response.json();
    
    // Ensure dates are properly parsed
    return {
      ...newNote,
      createdAt: new Date(newNote.createdAt),
      updatedAt: new Date(newNote.updatedAt)
    };
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

/**
 * Update an existing note
 */
export const updateNote = async (id: number, noteData: NoteFormValues): Promise<Note> => {
  try {
    const response = await fetch('/api/notes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        title: noteData.title,
        content: noteData.content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update note');
    }

    const updatedNote = await response.json();
    
    // Ensure dates are properly parsed
    return {
      ...updatedNote,
      createdAt: new Date(updatedNote.createdAt),
      updatedAt: new Date(updatedNote.updatedAt)
    };
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

/**
 * Delete a note by ID
 */
export const deleteNote = async (id: number): Promise<{ id: number }> => {
  try {
    const response = await fetch(`/api/notes?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete note');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};
