const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const database = require("./config/database");
const NoteRouter = require("./routes/notesRoutes");
const trashRouter = require("./routes/trashRoutes");
const tagsRouter = require("./routes/tagsRoutes");
const authRoutes = require("./routes/authRoutes");
app.use(cors());

database.connect();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/notes", NoteRouter);
app.use("/api/trash", trashRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
