import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

// =================================================================================
//                                  NOTES API
// =================================================================================

/**
 * Fetches all non-deleted notes from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of notes.
 */
export const fetchAllNotes = async () => {
  try {
    const { data } = await apiConnector("GET", endpoints.getAllNotes);
    // The backend sends all notes, so we filter out the deleted ones on the client.
    return data.filter((note) => !note.deleted) || [];
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Could not fetch notes.");
  }
};

/**
 * Creates a new note.
 * @param {Object} noteData - The data for the new note (title, content, tags).
 * @returns {Promise<Object>} A promise that resolves to the newly created note.
 */
export const createNote = async (noteData) => {
  try {
    const { data } = await apiConnector(
      "POST",
      endpoints.createNotes,
      noteData
    );
    return data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("Could not create note.");
  }
};

/**
 * Searches for notes by keyword.
 * @param {string} keyword - The keyword to search for.
 * @returns {Promise<Array>} A promise that resolves to an array of matching notes.
 */
export const searchNotes = async (keyword) => {
  try {
    const { data } = await apiConnector("GET", endpoints.searchNotes(keyword));
    return data || [];
  } catch (error) {
    console.error("Error searching notes:", error);
    throw new Error("Could not search notes.");
  }
};

/**
 * Updates an existing note by its ID.
 * @param {string} noteId - The ID of the note to update.
 * @param {Object} noteData - The updated data for the note (title, content, tags).
 * @returns {Promise<Object>} A promise that resolves to the updated note.
 */
export const updateNote = async (noteId, noteData) => {
  try {
    const { data } = await apiConnector(
      "PUT",
      endpoints.updateNoteById(noteId),
      noteData
    );
    return data;
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error("Could not update note.");
  }
};

/**
 * Soft deletes a note by its ID (moves it to the trash).
 * @param {string} noteId - The ID of the note to delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
export const deleteNote = async (noteId) => {
  try {
    const { data } = await apiConnector(
      "DELETE",
      endpoints.softDeleteNoteById(noteId)
    );
    return data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error("Could not delete note.");
  }
};

/**
 * Sends an array of note IDs to be moved to the trash.
 * @param {string[]} noteIds - An array of note IDs to delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
export const bulkDeleteNotes = async (noteIds) => {
  try {
    // The backend expects an object with a `notesIds` key which is an array
    const { data } = await apiConnector("DELETE", endpoints.bulkDelete, {
      notesIds: noteIds,
    });
    return data;
  } catch (error) {
    console.error("Error during bulk delete:", error);
    throw new Error("Could not perform bulk delete.");
  }
};

// =================================================================================
//                                  TRASH API
// =================================================================================

/**
 * Fetches all items currently in the trash.
 * @returns {Promise<Array>} A promise that resolves to an array of trashed items.
 */
export const fetchAllTrash = async () => {
  try {
    const { data } = await apiConnector("GET", endpoints.getAllTrash);
    return data || [];
  } catch (error) {
    console.error("Error fetching trash:", error);
    throw new Error("Could not fetch trash items.");
  }
};

/**
 * Restores a note from the trash.
 * @param {string} noteId - The ID of the note to restore.
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
export const restoreNoteFromTrash = async (noteId) => {
  try {
    const { data } = await apiConnector(
      "PUT",
      endpoints.restoreFromTrash(noteId)
    );
    return data;
  } catch (error) {
    console.error("Error restoring note:", error);
    throw new Error("Could not restore note.");
  }
};

/**
 * Permanently deletes a note from the database.
 * @param {string} noteId - The ID of the note to delete forever.
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
export const deleteNotePermanently = async (noteId) => {
  try {
    const { data } = await apiConnector(
      "DELETE",
      endpoints.permanentDelete(noteId)
    );
    return data;
  } catch (error) {
    console.error("Error permanently deleting note:", error);
    throw new Error("Could not permanently delete note.");
  }
};
