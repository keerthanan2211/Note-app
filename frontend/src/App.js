import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const apiUrl = "http://localhost:5000/api/notes";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddNoteDisabled, setIsAddNoteDisabled] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    setIsAddNoteDisabled(!(title.trim() && content.trim()));
  }, [title, content]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(apiUrl);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async () => {
    try {
      const response = await axios.post(apiUrl, { title, content });
      setNotes([...notes, response.data]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEditNote = async () => {
    try {
      await axios.put(`${apiUrl}/${selectedNote._id}`, {
        title: selectedNote.title,
        content: selectedNote.content,
      });
      fetchNotes(); // Refresh the notes after editing
      setShowEditModal(false); // Hide the edit modal
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (note) => {
    setSelectedNote({ ...note });
    setShowEditModal(true);
  };

  // Update the textarea height to be double
  const modalTextareaStyle = { height: "400px" };

  return (
    <div className="container">
      <h1>Note-taking App</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Notes"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* Update the textarea height */}
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={modalTextareaStyle}
        />
        <button onClick={handleAddNote} disabled={isAddNoteDisabled}>
          Add Note
        </button>
      </div>
      <div>
        <h2>Notes:</h2>
        {filteredNotes.map((note) => (
          <div className="note" key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="note-actions">
              {/* Add onClick event to call handleEditButtonClick with the note id */}
              <button
                className="small-button edit"
                onClick={() => openEditModal(note)}
              >
                Edit
              </button>
              <button
                className="small-button delete"
                onClick={() => handleDeleteNote(note._id)}
              >
                Delete
              </button>
              <button
                className="small-button share"
                onClick={() => {
                  const shareableLink = `${window.location.origin}/view/${note._id}`;
                  alert(`Shareable Link: ${shareableLink}`);
                }}
              >
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={selectedNote.title}
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, title: e.target.value })
              }
            />
            {/* Update the textarea height */}
            <textarea
              placeholder="Content"
              value={selectedNote.content}
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, content: e.target.value })
              }
              style={modalTextareaStyle}
            />
            <div className="modal-actions">
              <button className="small-button edit" onClick={handleEditNote}>
                Save
              </button>
              <button
                className="small-button cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
