import React from "react";

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  isSelectMode,
  onSelect,
  isSelected,
}) => {
  const handleCardClick = (e) => {
    if (isSelectMode) {
      e.stopPropagation();
      onSelect(note._id);
    } else {
      onEdit(note);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative rounded-2xl border p-6 flex flex-col justify-between group transition-all duration-300 cursor-pointer ${
        isSelected
          ? "bg-gray-100 border-gray-400 shadow-lg ring-2 ring-gray-300"
          : "bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm hover:shadow-xl hover:bg-white transform hover:scale-105"
      }`}
    >
      {/* Selection Checkbox */}
      {isSelectMode && (
        <div className="absolute top-4 right-4 z-10">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? "bg-gray-800 border-gray-800"
                : "border-gray-300 hover:border-gray-500"
            }`}
          >
            {isSelected && (
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Note Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 leading-tight">
          {truncateText(note.title || "Untitled Note", 50)}
        </h3>

        <p className="text-gray-600 mb-4 whitespace-pre-wrap leading-relaxed text-sm">
          {truncateText(note.content, 120)}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag._id || tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag.name || tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-400">
          <p>Updated {formatDate(note.updatedAt)}</p>
        </div>

        {!isSelectMode && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note._id);
              }}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="Delete Note"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
