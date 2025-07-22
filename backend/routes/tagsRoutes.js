const express = require("express");
const {
  getAllTags,
  createTag,
  deleteTag,
} = require("../controller/tagsController");
const router = express.Router();

router.get("/", getAllTags);
router.post("/", createTag);
router.delete("/:id", deleteTag);

module.exports = router;
