const Base_Url =
  import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:8080/api";

export const endpoints = {
  // Notes
  createNotes: `${Base_Url}/notes/create`,
  getAllNotes: `${Base_Url}/notes/notes`,
  getNoteById: (noteId) => `${Base_Url}/notes/notes/${noteId}`,
  updateNoteById: (noteId) => `${Base_Url}/notes/update/${noteId}`,
  softDeleteNoteById: (noteId) => `${Base_Url}/notes/softDelete/${noteId}`,
  searchNotes: (keyword) => `${Base_Url}/notes/search/${keyword}`,
  bulkDelete: `${Base_Url}/notes/bulkDelete`,

  // Trash
  getAllTrash: `${Base_Url}/trash/alltrash`,
  restoreFromTrash: (noteId) => `${Base_Url}/trash/restore/${noteId}`,
  permanentDelete: (noteId) => `${Base_Url}/trash/delete/${noteId}`,

  // Auth
  signup: `${Base_Url}/auth/signup`,
  login: `${Base_Url}/auth/login`,
  google: `${Base_Url}/auth/google`,
  setPassword: `${Base_Url}/auth/set-password`,
};