import React, { useState, useRef, useEffect } from "react";
import { createNote } from "../services/operations/notesAPI";
import CrossIcon from "../Icons/CrossIcon";

const CreateNote = ({ onNoteCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        formRef.current?.querySelector("input[type='text']")?.focus();
      }, 100);
    }
  }, [isExpanded]);

  const handleClose = async () => {
    if (title.trim() || content.trim()) {
      await handleSaveNote();
    } else {
      resetForm();
    }
  };

  const handleSaveNote = async () => {
    if (!title.trim() && !content.trim()) {
      resetForm();
      return;
    }

    setIsLoading(true);
    try {
      const noteData = {
        title: title.trim() || "Untitled",
        content: content.trim(),
        tags: tags.trim()
          ? tags.split(",").map((tag) => tag.trim()).filter((tag) => tag)
          : [],
      };

      await createNote(noteData);
      onNoteCreated();
      resetForm();
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setIsExpanded(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveNote();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSaveNote();
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto mb-12 z-40 transition-all duration-500 ease-in-out ${isExpanded ? "pt-8" : "pt-0"}`}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`bg-white/95 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-xl overflow-hidden transition-all duration-500 ease-in-out transform animate-fade-in ${
          isExpanded ? "max-h-[1000px]" : "max-h-[120px]"
        }`}
      >
        {isExpanded && (
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Create Note</span>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 transform hover:scale-110"
            >
              <CrossIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {isExpanded && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Note title"
            className="w-full p-6 text-xl font-semibold text-gray-800 placeholder-gray-400 bg-transparent border-b border-gray-100 focus:outline-none"
            disabled={isLoading}
          />
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          placeholder="Take a note..."
          rows={isExpanded ? 6 : 1}
          className="w-full p-6 text-lg text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none resize-none leading-relaxed"
          disabled={isLoading}
        />

        {isExpanded && (
          <>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tags (comma separated)"
              className="w-full p-6 text-sm text-gray-600 placeholder-gray-400 bg-transparent border-t border-gray-100 focus:outline-none"
              disabled={isLoading}
            />

            <div className="flex justify-end items-center p-6 bg-gray-50/80 border-t border-gray-100 rounded-b-3xl">
              <button
                type="submit"
                className="px-6 py-2 text-sm bg-gray-800 text-white font-medium rounded-full hover:bg-gray-700 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Note"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};


export default CreateNote;
