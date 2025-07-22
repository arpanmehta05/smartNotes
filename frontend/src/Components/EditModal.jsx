import React, { useState, useEffect, useRef } from "react";
import { updateNote } from "../services/operations/notesAPI";
import CrossIcon from "../Icons/CrossIcon";

const EditModal = ({
  note,
  isOpen,
  onClose,
  onUpdateSuccess,
  notePosition,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const modalRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setTags(note.tags?.map((tag) => tag.name || tag).join(", ") || "");
      setHasChanges(false);
    }
  }, [note]);
  useEffect(() => {
    if (hasChanges) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, content, tags, hasChanges]);

  // Handle click outside to close and auto-save
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseWithSave();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, hasChanges]);

  const handleChange = (field, value) => {
    if (field === "title") {
      setTitle(value);
    } else if (field === "content") {
      setContent(value);
    } else if (field === "tags") {
      setTags(value);
    }
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        title: title.trim() || "Untitled",
        content: content.trim(),
        tags: tags.trim()
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
      };

      await updateNote(note._id, updateData);
      onUpdateSuccess();
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseWithSave = async () => {
    if (hasChanges) {
      await handleSave();
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      handleCloseWithSave();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 animate-scale-in"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-xs text-gray-500">
                {isLoading ? "Saving..." : "Auto-saving..."}
              </span>
            )}
          </div>
          <button
            onClick={handleCloseWithSave}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => handleChange("title", e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-3xl font-bold text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
              placeholder="Untitled Note"
              disabled={isLoading}
            />
          </div>

          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={(e) => handleChange("content", e.target.value)}
              onKeyDown={handleKeyDown}
              rows={15}
              className="w-full text-lg text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none leading-relaxed"
              placeholder="Start writing your note..."
              disabled={isLoading}
            />
          </div>

          {/* Tags */}
          <div>
            <input
              type="text"
              value={tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
              placeholder="Add tags (comma separated)"
              disabled={isLoading}
            />
          </div>

          {/* Note Info */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Created: {formatDate(note.createdAt)}</span>
              <span>Updated: {formatDate(note.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-400">
            Click outside to save and close • Ctrl+Enter to save • Esc to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
