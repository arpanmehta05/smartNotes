const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createNote,
  getNotesById,
  getAllNotes,
  updateNote,
  softDeleteNote,
  searchNotesByKeyword,
  BulkDeleteNotes,
} = require("../controller/notesController");

router.post("/create", auth, createNote);
router.get("/notes/:id", auth, getNotesById);
router.get("/notes", auth, getAllNotes);
router.put("/update/:id", auth, updateNote);
router.delete("/softDelete/:id", auth, softDeleteNote);
router.get("/search/:keyword", auth, searchNotesByKeyword);
router.delete("/bulkDelete", auth, BulkDeleteNotes);

module.exports = router;
