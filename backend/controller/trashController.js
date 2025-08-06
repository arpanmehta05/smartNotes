const { noteModel } = require("../model/notesModel");
const { trashModel } = require("../model/trashModel");

exports.getTrash = async (req, res) => {
  try {
    const trashedItems = await trashModel.find().populate({
      path: "noteId",
      match: { user: req.user._id },
      select: "title content",
    });
    const filtered = trashedItems.filter((item) => item.noteId !== null);
    res.status(200).json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.restoreTrash = async (req, res) => {
  try {
    const { noteId } = req.params;
    const restoredItem = await trashModel
      .findOne({ noteId })
      .populate({ path: "noteId", match: { user: req.user._id } });
    if (!restoredItem || !restoredItem.noteId) {
      return res.status(404).json({ message: "Item not found in trash" });
    }
    const note = await noteModel.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.deleted = false;
    await note.save();
    await trashModel.deleteMany({ noteId });
    res
      .status(200)
      .json({ message: "Item restored successfully", restoredItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteTrash = async (req, res) => {
  try {
    const { noteId } = req.params;
    const deletedItem = await trashModel.findOne({ noteId });
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in trash" });
    }
    const note = await noteModel.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    await trashModel.deleteMany({ noteId });
    await noteModel.findByIdAndDelete(noteId);
    res.status(200).json({ message: "Item deleted from trash successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
