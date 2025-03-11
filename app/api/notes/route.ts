import sql from '@/lib/db';

export const GET = async () => {
  try {
    const result = await sql`SELECT * FROM note`;
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
    
    // Insert the new note with PostgreSQL compatible syntax
    const result = await sql`
      INSERT INTO note (title, content, "createdAt", "updatedAt") 
      VALUES (${title || ''}, ${content || ''}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    // Check if we got a result
    if (!result || result.length === 0) {
      throw new Error("Failed to create note - no result returned");
    }
    
    return Response.json(result[0]);
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
    
    // Update the note with PostgreSQL compatible syntax
    const result = await sql`
      UPDATE note 
      SET 
        title = ${title}, 
        content = ${content}, 
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (!result || result.length === 0) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }
    
    return Response.json(result[0]);
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
    
    // Delete the note with PostgreSQL compatible syntax
    const result = await sql`
      DELETE FROM note 
      WHERE id = ${parseInt(id, 10)}
      RETURNING id
    `;
    
    if (!result || result.length === 0) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }
    
    return Response.json({ id: result[0].id });
  } catch (error) {
    console.error("Error deleting note:", error);
    return Response.json({ 
      error: "Failed to delete note", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};
