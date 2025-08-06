const { tagModel } = require("../model/tagsModel");

exports.getAllTags = async (req, res) => {
  try {
    const tags = await tagModel.find({ user: req.user._id }).sort({ name: 1 });
    res.status(200).json(tags);
  } catch (err) {
    console.error("Error fetching tags:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const existingTag = await tagModel.findOne({ name, user: req.user._id });
    if (existingTag) {
      return res.status(409).json({ message: "Tag already exists" });
    }

    const newTag = new tagModel({ name, user: req.user._id });
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTag = await tagModel.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    console.error("Error deleting tag:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
