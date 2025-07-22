const { noteModel } = require("../model/notesModel");
const { trashModel } = require("../model/trashModel");

exports.getTrash = async (req, res) => {
  try {
    const trashedItems = await trashModel
      .find()
      .populate("noteId", "title content");
    res.status(200).json(trashedItems);
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
      .populate("noteId");
    if (!restoredItem) {
      return res.status(404).json({ message: "Item not found in trash" });
    }
    const note = await noteModel.findById(noteId);
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
    await trashModel.deleteMany({ noteId }); // Delete all trash entries for this note
    await noteModel.findByIdAndDelete(noteId); // Permanently delete the note
    res.status(200).json({ message: "Item deleted from trash successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
