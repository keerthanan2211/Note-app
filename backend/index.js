const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/note-taking-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: "desc" });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ title, content });

  try {
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Note.findByIdAndDelete(id);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

app.get("/api/notes/:id/share", async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ error: "Note not found" });
    } else {
      const shareableLink = `http://your-frontend-url/view/${id}`;
      res.json({ shareableLink });
    }
  } catch (error) {
    console.error("Error fetching note for sharing:", error);
    res.status(500).json({ error: "Failed to fetch note for sharing" });
  }
});

// Add the following line to start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
