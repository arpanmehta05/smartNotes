const Base_Url =
  import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:8080/api";

export const endpoints = {
  createNotes: `${Base_Url}/notes/create`,
  getAllNotes: `${Base_Url}/notes/notes`,
  getNoteById: (noteId) => `${Base_Url}/notes/notes/${noteId}`,
  updateNoteById: (noteId) => `${Base_Url}/notes/update/${noteId}`,
  softDeleteNoteById: (noteId) => `${Base_Url}/notes/softDelete/${noteId}`,
  searchNotes: (keyword) => `${Base_Url}/notes/search/${keyword}`,
  bulkDelete: `${Base_Url}/notes/bulkDelete`,
  getAllTrash: `${Base_Url}/trash/alltrash`,
  restoreFromTrash: (noteId) => `${Base_Url}/trash/restore/${noteId}`,
  permanentDelete: (noteId) => `${Base_Url}/trash/delete/${noteId}`,
};
