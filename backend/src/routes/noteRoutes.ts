// src/routes/noteRoutes.ts
import express from 'express';
import Note from '../models/Note';
import { verifyToken } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';

// Define the custom request type locally, keeping user optional to match middleware contract
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const router = express.Router();

// Get all notes
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    // Assert that user exists because verifyToken middleware ensures it
    const userId = req.user!.id;
    const notes = await Note.find({ author: userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

// Create a note
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    // Assert that user exists
    const userId = req.user!.id;
    const note = new Note({
      title,
      content,
      author: userId,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: 'Failed to create note' });
  }
});

// // Let's assume a PUT route for updating the entire note
//       const res = await api.put<Note>(`/api/notes/${editingNoteId}`, {
//         title: editNoteTitle,
//         content: editNoteContent,
//       });


router.put('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try{
    const userId = req.user!.id;
    const noteId = req.params.id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the note belongs to the user
    if (note.author.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    note.title = title;
    note.content = content;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: 'Failed to update note' });
  }
});

// Delete a note
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    // Assert that user exists
    const userId = req.user!.id;
    const noteId = req.params.id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the note belongs to the user
    if (note.author.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Use deleteOne for Mongoose v7+
    await Note.deleteOne({ _id: noteId });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

export default router;