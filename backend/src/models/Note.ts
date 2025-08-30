import { Document, Schema, model, models } from 'mongoose';

// Interface for Note document
export interface INote extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// Define Note Schema
const NoteSchema = new Schema<INote>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content too long'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware: Update `updatedAt` before saving
NoteSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for author to speed up queries
NoteSchema.index({ author: 1 });

const Note = models.Note || model<INote>('Note', NoteSchema);

export default Note;