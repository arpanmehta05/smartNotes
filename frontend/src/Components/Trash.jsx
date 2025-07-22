import React, { useState, useEffect, useCallback } from "react";
import {
  fetchAllTrash,
  restoreNoteFromTrash,
  deleteNotePermanently,
} from "../services/operations/notesAPI";
import Navbar from "./Navbar";
import BinIcon from "../Icons/Bin";
import RestoreIcon from "../Icons/Restore";

export default function Trash() {
  const [trashedItems, setTrashedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update document title
  useEffect(() => {
    document.title = "Trash - Smartnotes";
  }, []);

  const getTrash = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllTrash();
      setTrashedItems(data);
    } catch (err) {
      setError(err.message || "Failed to fetch trash.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getTrash();
  }, [getTrash]);

  const handleRestore = async (noteId) => {
    try {
      await restoreNoteFromTrash(noteId);
      setTrashedItems((prev) =>
        prev.filter((item) => item.noteId._id !== noteId)
      );
    } catch (err) {
      console.error("Failed to restore note:", err);
    }
  };

  const handleDeletePermanent = async (noteId) => {
    if (
      !window.confirm("Delete this note forever? This action cannot be undone.")
    ) {
      return;
    }
    try {
      await deleteNotePermanently(noteId);
      setTrashedItems((prev) =>
        prev.filter((item) => item.noteId._id !== noteId)
      );
    } catch (err) {
      console.error("Failed to permanently delete note:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading deleted notes...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">⚠️</div>
            <p className="text-gray-500 text-lg mb-4">{error}</p>
            <button
              onClick={getTrash}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {trashedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <BinIcon className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-500 text-xl mb-2">Trash is empty</p>
              <p className="text-gray-400">Deleted notes are kept here for 30 days</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {trashedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex-1 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">
                      {truncateText(item.noteId?.title || "Untitled Note", 40)}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {truncateText(item.noteId?.content || "No content", 100)}
                    </p>

                    {item.noteId?.tags && item.noteId.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.noteId.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag._id || tag}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {tag.name || tag}
                          </span>
                        ))}
                        {item.noteId.tags.length > 2 && (
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">
                            +{item.noteId.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs text-gray-400 mb-4">
                      Deleted {formatDate(item.deletedAt)}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(item.noteId._id)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <RestoreIcon className="w-4 h-4" />
                        Restore
                      </button>
                      <button
                        onClick={() => handleDeletePermanent(item.noteId._id)}
                        className="flex-1 bg-gray-700 text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <BinIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
