const express = require("express");
const {
  getTrash,
  deleteTrash,
  restoreTrash,
} = require("../controller/trashController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/alltrash", auth, getTrash);
router.delete("/delete/:noteId", auth, deleteTrash);
router.put("/restore/:noteId", auth, restoreTrash);

module.exports = router;
