import { prisma } from "@/lib/db";

export const GET = async () => {
  try {
    const result = await prisma.note.findMany();
    return Response.json(result);
} catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch notes" }, { status: 500 });
}
};

export const POST = async (request: Request) => {
  try {
    // Get the request body
    const { title, content } = await request.json();
    
    // Validate the input
    if (!title && !content) {
      return Response.json({ error: "Title or content is required" }, { status: 400 });
    }
    
    // Create the new note using Prisma
    const result = await prisma.note.create({
      data: {
        title: title || '',
        content: content || '',
      }
    });
    
    return Response.json(result);
  } catch (error) {
    console.error("Error creating note:", error);
    return Response.json({ 
      error: "Failed to create note", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};

export const PUT = async (request: Request) => {
  try {
    // Get the request body
    const { id, title, content } = await request.json();
    
    // Validate the input
    if (!id) {
      return Response.json({ error: "Note ID is required" }, { status: 400 });
    }
    
    if (!title && !content) {
      return Response.json({ error: "Title or content is required" }, { status: 400 });
    }
    
    // Find the note first to check if it exists
    const existingNote = await prisma.note.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingNote) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }
    
    // Update the note using Prisma
    const result = await prisma.note.update({
      where: { id: Number(id) },
      data: {
        title: title || existingNote.title,
        content: content || existingNote.content,
      }
    });
    
    return Response.json(result);
  } catch (error) {
    console.error("Error updating note:", error);
    return Response.json({ 
      error: "Failed to update note", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    // Get the URL parameters
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    // Validate the input
    if (!id) {
      return Response.json({ error: "Note ID is required" }, { status: 400 });
    }
    
    // Find the note first to check if it exists
    const existingNote = await prisma.note.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingNote) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }
    
    // Delete the note using Prisma
    await prisma.note.delete({
      where: { id: Number(id) }
    });
    
    return Response.json({ id: Number(id) });
  } catch (error) {
    console.error("Error deleting note:", error);
    return Response.json({ 
      error: "Failed to delete note", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};
