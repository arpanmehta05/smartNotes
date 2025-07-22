import React, { useEffect, useState, useCallback } from "react";
import {
  fetchAllNotes,
  deleteNote,
  bulkDeleteNotes,
  searchNotes,
} from "../services/operations/notesAPI";
import Navbar from "./Navbar";
import NoteCard from "./NotesCard";
import CreateNote from "./CreateNote";
import EditModal from "./EditModal";
import BinIcon from "../Icons/Bin";
import ErrorModal from "./ErrorModal";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState(new Set());

  const [expandedNote, setExpandedNote] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    message: "",
    onConfirm: null,
  });

  // Update document title
  useEffect(() => {
    document.title = "Smartnotes - Your Intelligent Note-Taking App";
  }, []);

  // --- Data Fetching ---
  const getNotes = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedNotes = await fetchAllNotes();
      setNotes(fetchedNotes);
      setAllNotes(fetchedNotes);
    } catch (err) {
      setError(err.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  // --- Search Functionality ---
  const handleSearch = useCallback(
    async (query) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setNotes(allNotes);
        return;
      }

      try {
        const searchResults = await searchNotes(query);
        setNotes(searchResults);
      } catch (error) {
        console.error("Search failed:", error);
        // Fallback to local search
        const filteredNotes = allNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        );
        setNotes(filteredNotes);
      }
    },
    [allNotes]
  );

  const handleDeleteNote = (noteId) => {
    setConfirmModal({
      open: true,
      message: "Move this note to the trash?",
      onConfirm: async () => {
        setConfirmModal({ open: false, message: "", onConfirm: null });
        try {
          await deleteNote(noteId);
          setNotes((prev) => prev.filter((note) => note._id !== noteId));
          setAllNotes((prev) => prev.filter((note) => prev._id !== noteId));
        } catch (err) {
          setError("Error: Could not move note to trash.");
        }
      },
    });
  };

  const handleEditNote = (note) => {
    setExpandedNote(note);
  };

  const handleCloseExpandedNote = () => {
    setExpandedNote(null);
  };

  const handleUpdateSuccess = (updatedNote) => {
    // Update the note in-place in notes and allNotes arrays
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id ? { ...note, ...updatedNote } : note
      )
    );
    setAllNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id ? { ...note, ...updatedNote } : note
      )
    );
    if (expandedNote && updatedNote && expandedNote._id === updatedNote._id) {
      setExpandedNote((prev) => ({ ...prev, ...updatedNote }));
    }
  };

  // --- Bulk Selection Logic ---
  const toggleSelectMode = () => {
    setIsSelectMode((prev) => !prev);
    setSelectedNotes(new Set());
  };

  const handleSelectNote = (noteId) => {
    setSelectedNotes((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(noteId)) {
        newSelected.delete(noteId);
      } else {
        newSelected.add(noteId);
      }
      return newSelected;
    });
  };

  const handleBulkDelete = () => {
    const noteIds = Array.from(selectedNotes);
    if (noteIds.length === 0) return;
    setConfirmModal({
      open: true,
      message: `Move ${noteIds.length} selected notes to the trash?`,
      onConfirm: async () => {
        setConfirmModal({ open: false, message: "", onConfirm: null });
        try {
          await bulkDeleteNotes(noteIds);
          setNotes((prev) =>
            prev.filter((note) => !noteIds.includes(note._id))
          );
          setAllNotes((prev) =>
            prev.filter((note) => !noteIds.includes(note._id))
          );
          toggleSelectMode();
        } catch (err) {
          setError("Error: Could not perform bulk delete.");
        }
      },
    });
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <>
        <Navbar onSearch={handleSearch} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your notes...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar
          onSearch={handleSearch}
          onToggleSelectMode={toggleSelectMode}
          isSelectMode={isSelectMode}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No notes found</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        onSearch={handleSearch}
        onToggleSelectMode={toggleSelectMode}
        isSelectMode={isSelectMode}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isSelectMode && <CreateNote onNoteCreated={getNotes} />}
          <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
            {notes.length > 0
              ? notes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    isSelectMode={isSelectMode}
                    isSelected={selectedNotes.has(note._id)}
                    onSelect={handleSelectNote}
                  />
                ))
              : !searchQuery && (
                  <div className="col-span-full text-center py-16">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <p className="text-gray-500 text-xl mb-2">
                      Your notebook is empty
                    </p>
                    <p className="text-gray-400">
                      Create your first note to get started!
                    </p>
                  </div>
                )}
          </main>
        </div>
      </div>

      {/* Bulk Delete Action Bar */}
      {isSelectMode && selectedNotes.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="font-semibold text-gray-700">
              {selectedNotes.size} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <BinIcon className="w-5 h-5" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Expanded Note Modal */}
      {expandedNote && (
        <EditModal
          note={expandedNote}
          isOpen={!!expandedNote}
          onClose={handleCloseExpandedNote}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={!!error}
        message={error}
        onClose={() => setError(null)}
      />

      {confirmModal.open && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
          onClick={() =>
            setConfirmModal({ open: false, message: "", onConfirm: null })
          }
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-gray-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 text-gray-800 font-semibold text-lg text-center">
              Confirm
            </div>
            <div className="mb-6 text-gray-700 text-center">
              {confirmModal.message}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  confirmModal.onConfirm && confirmModal.onConfirm();
                }}
                className="px-4 py-2 bg-white text-gray-800 rounded-2xl border border-gray-300 hover:bg-gray-100 transition-colors w-full shadow font-semibold"
              >
                Yes
              </button>
              <button
                onClick={() =>
                  setConfirmModal({ open: false, message: "", onConfirm: null })
                }
                className="px-4 py-2 bg-white text-gray-800 rounded-2xl border border-gray-300 hover:bg-gray-100 transition-colors w-full shadow font-semibold"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
