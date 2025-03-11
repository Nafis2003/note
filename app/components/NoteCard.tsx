import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Note } from "@/lib/types";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  // Safely parse dates
  const safelyParseDate = (dateString: string | Date): Date => {
    if (dateString instanceof Date) return dateString;
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return new Date(); // Fallback to current date if invalid
      }
      return date;
    } catch (error) {
      console.error("Error parsing date:", error);
      return new Date(); // Fallback to current date
    }
  };

  // Format date for display
  const formatDate = (dateInput: string | Date) => {
    const date = safelyParseDate(dateInput);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Safely parse dates for comparison
  const createdAt = safelyParseDate(note.createdAt);
  const updatedAt = safelyParseDate(note.updatedAt);

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md border-border/60 hover:border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold line-clamp-1">{note.title}</CardTitle>
        <CardDescription className="text-xs space-y-1 mt-1">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground/80">Created:</span> 
            <span>{formatDate(note.createdAt)}</span>
          </div>
          {updatedAt > createdAt && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground/80">Updated:</span> 
              <span>{formatDate(note.updatedAt)}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="whitespace-pre-wrap text-sm text-foreground/80 line-clamp-6 h-[120px] overflow-hidden">
          {note.content}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t bg-muted/20">
        <Button variant="outline" size="sm" onClick={() => onEdit(note)} className="text-xs h-8">
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(note.id)} className="text-xs h-8">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
