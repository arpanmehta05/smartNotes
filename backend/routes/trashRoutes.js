const express = require("express");
const {
  getTrash,
  deleteTrash,
  restoreTrash,
} = require("../controller/trashController");
const router = express.Router();

router.get("/alltrash", getTrash);
router.delete("/delete/:noteId", deleteTrash);
router.put("/restore/:noteId", restoreTrash);

module.exports = router;
