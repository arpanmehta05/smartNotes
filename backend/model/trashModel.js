const mongoose = require("mongoose");

const trashSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
  deletedAt: { type: Date, default: Date.now },
});
exports.trashModel = mongoose.model("Trash", trashSchema);