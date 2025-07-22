const { noteModel } = require("../model/notesModel");
const { trashModel } = require("../model/trashModel");
const { tagModel } = require("../model/tagsModel");

exports.createNote = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    if (req.body.tags && !Array.isArray(req.body.tags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }

    let tagIds = [];
    if (req.body.tags && req.body.tags.length > 0) {
      for (const tagName of req.body.tags) {
        let tag = await tagModel.findOne({ name: tagName });
        if (!tag) {
          tag = new tagModel({ name: tagName });
          await tag.save();
        }
        tagIds.push(tag._id);
      }
    }

    const newNote = new noteModel({
      title: req.body.title,
      content: req.body.content,
      tags: tagIds,
    });
    const savedNote = await newNote.save();
    const populatedNote = await noteModel
      .findById(savedNote._id)
      .populate("tags");
    res.status(201).json(populatedNote);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const { tag, date, deleted } = req.query;
    let filter = {};
    if (tag) {
      filter.tags = tag;
    }
    if (date) {
      const dateObj = new Date(date);
      filter.createdAt = { $gte: dateObj };
    }
    if (deleted) {
      filter.deleted = deleted === "true";
    }
    const notes = await noteModel
      .find(filter)
      .populate("tags")
      .sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getNotesById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await noteModel.findById(id).populate("tags");
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (err) {
    console.error("Error fetching note by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (content) updates.content = content;

    if (tags && Array.isArray(tags)) {
      let tagIds = [];
      for (const tagName of tags) {
        let tag = await tagModel.findOne({ name: tagName });
        if (!tag) {
          tag = new tagModel({ name: tagName });
          await tag.save();
        }
        tagIds.push(tag._id);
      }
      updates.tags = tagIds;
    }

    updates.updatedAt = new Date();

    const updatedNote = await noteModel
      .findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .populate("tags");
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.softDeleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.deleted = true;
    const deletedNote = await trashModel.create({
      noteId: id,
      deletedAt: new Date(),
    });
    await note.save();
    res.status(200).json({ message: "Note soft deleted", deletedNote });
  } catch (err) {
    console.error("Error soft deleting note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchNotesByKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;
    const notes = await noteModel
      .find({
        deleted: false,
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { content: { $regex: keyword, $options: "i" } },
        ],
      })
      .populate("tags");
    res.status(200).json(notes);
  } catch (err) {
    console.error("Error searching notes by keyword:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.BulkDeleteNotes = async (req, res) => {
  try {
    const { notesIds } = req.body;
    if (!Array.isArray(notesIds) || notesIds.length === 0) {
      return res.status(400).json({ message: "Invalid notes IDs" });
    }
    const deletedNotes = await noteModel.updateMany(
      { _id: { $in: notesIds } },
      { $set: { deleted: true } }
    );
    const trashEntries = notesIds.map((id) => ({
      noteId: id,
      deletedAt: new Date(),
    }));
    await trashModel.insertMany(trashEntries);
    if (deletedNotes.modifiedCount === 0) {
      return res.status(404).json({ message: "No notes found to delete" });
    }
    res.status(200).json({
      message: "Notes successfully deleted",
      deletedCount: deletedNotes.modifiedCount,
    });
  } catch (err) {
    console.error("Error bulk deleting notes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
