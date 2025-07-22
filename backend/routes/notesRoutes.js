const express = require("express");
const {
  createNote,
  getNotesById,
  getAllNotes,
  updateNote,
  softDeleteNote,
  searchNotesByKeyword,
  BulkDeleteNotes,
} = require("../controller/notesController");
const router = express.Router();

router.post("/create", createNote);
router.get("/notes/:id", getNotesById);
router.get("/notes", getAllNotes);
router.put("/update/:id", updateNote);
router.delete("/softDelete/:id", softDeleteNote);
router.get("/search/:keyword",searchNotesByKeyword);
router.delete("/bulkDelete",BulkDeleteNotes);

module.exports = router;
