"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Trash2, Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  updatedAt: Date;
};

const COLORS = [
  "#202124", // default
  "#143642", // teal
  "#A71D31", // burgundy
  "#8D775F", // taupe
  "#F75590", // pink
  "#2C0E37", // purple
  "#E09891", // salmon
  "#ADBCA5", // sage
  "#119DA4", // blue-green
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize notes from localStorage after mounting
  useEffect(() => {
    setIsClient(true);
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(storedNotes);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes, isClient]);

  const handleCreateNote = () => {
    if (!newNote.title || !newNote.content) return;

    const note: Note = {
      id: crypto.randomUUID(),
      title: newNote.title,
      content: newNote.content,
      color: COLORS[0],
      updatedAt: new Date(),
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "" });
  };

  const updateNoteColor = (noteId: string, color: string) => {
    setNotes(
      notes.map((note) => (note.id === noteId ? { ...note, color } : note))
    );
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleSaveEdit = () => {
    if (!editingNote) return;

    setNotes(
      notes.map((note) => (note.id === editingNote.id ? editingNote : note))
    );
    setEditingNote(null);
  };

  const getContrastColor = (backgroundColor: string): string => {
    // Convert hex to RGB
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#202124" : "#FFFFFF";
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Dialog
          open={!!editingNote}
          onOpenChange={(open) => !open && setEditingNote(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Note title"
                value={editingNote?.title || ""}
                onChange={(e) =>
                  setEditingNote((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
              />
              <Textarea
                placeholder="Note content"
                value={editingNote?.content || ""}
                onChange={(e) =>
                  setEditingNote((prev) =>
                    prev ? { ...prev, content: e.target.value } : null
                  )
                }
                className="min-h-[200px]  max-h-[300px]"
              />
              <div className="grid grid-cols-3 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      setEditingNote((prev) =>
                        prev ? { ...prev, color } : null
                      )
                    }
                    className={cn(
                      "h-8 w-8 rounded-full border cursor-pointer transition-transform hover:scale-110",
                      editingNote?.color === color && "ring-2 ring-primary"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Button onClick={handleSaveEdit} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <header className="mb-12 text-center">
          <h1 className="text-4xl bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent font-bold">
            Modern Notes
          </h1>
        </header>

        <div className="mb-12 space-y-4 bg-muted/50 p-6 rounded-xl border">
          <Input
            placeholder="Note title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="text-lg font-semibold border-none bg-transparent"
          />
          <Textarea
            placeholder="Start typing..."
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
            className="min-h-[120px] border-none bg-transparent resize-none max-h-[300px]"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleCreateNote}
              disabled={!newNote.title.trim() || !newNote.content.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </div>
        </div>

        {isClient && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="relative transition-transform hover:scale-[1.02] border-border/50 group"
                style={{ backgroundColor: note.color }}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className="text-lg truncate"
                    style={{ color: getContrastColor(note.color) }}
                  >
                    {note.title}
                  </CardTitle>
                  <time
                    className="text-xs"
                    style={{ color: getContrastColor(note.color) }}
                  >
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </time>
                </CardHeader>
                <CardContent
                  className="text-sm max-h-[200px] overflow-y-auto whitespace-normal break-words p-4"
                  style={{ color: getContrastColor(note.color) }}
                >
                  {note.content}
                </CardContent>

                {/* Note Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-black/10" // Add hover background
                    style={{ color: getContrastColor(note.color) }} // Set icon color dynamically
                    onClick={() => setEditingNote(note)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Color Picker Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-black/10" // Add hover background
                        style={{ color: getContrastColor(note.color) }} // Set icon color dynamically
                      >
                        <Palette className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 p-2 grid grid-cols-3 gap-1">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateNoteColor(note.id, color)}
                          className="h-8 w-8 rounded-full border cursor-pointer transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-black/10" // Add hover background
                    style={{ color: getContrastColor(note.color) }} // Set icon color dynamically
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
