import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance'; // Import your configured axios instance
// import type { AxiosResponse } from 'axios'; // For typing API responses

// Define the note interface based on your backend model
interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt?: string; // Optional, might be sent by backend
  updatedAt?: string; // Optional, might be sent by backend
}

const DashboardPage = () => {
  const { user, logout, token } = useAuth(); // Get token for API calls if needed
  const navigate = useNavigate();

  // State for managing notes and loading
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for managing modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // State for form inputs
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');

console.log("user",user)
  // Fetch notes from the backend when the component mounts or user/token changes
  useEffect(() => {

    const fetchNotes = async () => {
      if (!token) {
        // If there's no token, the user shouldn't be here
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // GET /api/notes
        const res = await api.get<Note[]>('/api/notes');
        setNotes(res.data);
      } catch (err: any) {
        console.error('Error fetching notes:', err);
        setError(err.response?.data?.message || 'Failed to load notes.');
        // If it's an auth error, log out
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token, navigate, logout]); // Re-run if token or navigate changes

  // Handle create note button click
  const handleCreateNoteClick = () => {
    setIsCreateModalOpen(true);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  // Handle create note form submission
  const handleCreateNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      // POST /api/notes
      const res = await api.post<Note>('/api/notes', {
        title: newNoteTitle,
        content: newNoteContent,
      });

      // Add the new note to the state (at the beginning for newest first)
      setNotes([res.data, ...notes]);
      setIsCreateModalOpen(false);
    } catch (err: any) {
      console.error('Error creating note:', err);
      alert(err.response?.data?.message || 'Failed to create note.');
    }
  };

  // Handle edit note button click
  const handleEditNoteClick = (noteId: string) => {
    const noteToEdit = notes.find(n => n._id === noteId);
    if (noteToEdit) {
      setEditingNoteId(noteId);
      setEditNoteTitle(noteToEdit.title);
      setEditNoteContent(noteToEdit.content);
      setIsEditModalOpen(true);
    }
  };

  // Handle edit note form submission
  const handleEditNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNoteTitle.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!editingNoteId) return; // Should not happen

    try {
      // PUT /api/notes/:id (assuming your backend has a PUT route)
      // If not, you might need to use PATCH or a custom update route
      // For now, let's assume a PUT route at /api/notes/:id
      // If your backend only supports DELETE/POST, you might DELETE and CREATE
      // Or have a separate PATCH route. Check your backend implementation.
      
      // Let's assume a PUT route for updating the entire note
      const res = await api.put<Note>(`/api/notes/${editingNoteId}`, {
        title: editNoteTitle,
        content: editNoteContent,
      });

      // Update the note in the state
      setNotes(
        notes.map(note =>
          note._id === editingNoteId ? res.data : note
        )
      );

      setIsEditModalOpen(false);
      setEditingNoteId(null);
    } catch (err: any) {
      console.error('Error updating note:', err);
      alert(err.response?.data?.message || 'Failed to update note.');
    }
  };

  // Handle delete note
  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        // DELETE /api/notes/:id
        await api.delete(`/api/notes/${noteId}`);

        // Remove the note from the state
        setNotes(notes.filter(note => note._id !== noteId));
      } catch (err: any) {
        console.error('Error deleting note:', err);
        alert(err.response?.data?.message || 'Failed to delete note.');
      }
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                <path d="M10 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-800">HD-Notes</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-gray-700 hidden md:inline">
                {/* Welcome, {user.name || user.email} */}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className=" border-2 p-3 rounded-2xl  mb-8 border-gray-400">
          {user && (
                <>
                <div>
                    <span className="text-gray-700 hidden md:inline text-2xl font-bold">
                        Welcome, {user.name || user.email}
                    </span>
                </div>
                <div>
                    <span>
                        Email: {user.email}
                    </span>
                </div>
                </>
            )}
          <h2 className=''>
            
          </h2>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
          <button
            onClick={handleCreateNoteClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Note
          </button>
        </div>

        {/* Notes List or Loading/Error */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notes yet</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new note.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateNoteClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Create your first note
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <div key={note._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{note.title}</h3>
                  <p className="mt-2 text-gray-600 line-clamp-3">{note.content}</p>
                </div>
                <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditNoteClick(note._id)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Note Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Create New Note</h3>
            </div>
            <form onSubmit={handleCreateNoteSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="newNoteTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="newNoteTitle"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Note title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newNoteContent" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="newNoteContent"
                    rows={4}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Note content"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Create Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Edit Note</h3>
            </div>
            <form onSubmit={handleEditNoteSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="editNoteTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="editNoteTitle"
                    value={editNoteTitle}
                    onChange={(e) => setEditNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Note title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editNoteContent" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="editNoteContent"
                    rows={4}
                    value={editNoteContent}
                    onChange={(e) => setEditNoteContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Note content"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Update Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;