import React, { useState } from "react";
import { Note } from "../types/types";
import { useDeleteNotesMutation, useGetAllNotesQuery, useUpdateNotesMutation } from "../redux/notesApi";
import { Modal, Backdrop, Fade, Button, TextField } from "@mui/material";

interface GetAllNotesProps {
  note: Note;
}

const GetAllNotes = ({ note }: GetAllNotesProps) => {
  const [updatedTitle, setUpdatedTitle] = useState(note.title);
  const [updatedContent, setUpdatedContent] = useState(note.content);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);

  const [updateNote] = useUpdateNotesMutation();
  const [deleteNote] = useDeleteNotesMutation();
  const { refetch } = useGetAllNotesQuery();

  const handleUpdate = async () => {
    try {
      await updateNote({
        id: note._id,
        title: updatedTitle,
        content: updatedContent,
      });
      setEditMode(!editMode);
      setOpenModal(false);
      refetch();
    } catch (error) {
      console.log("Error updating note", error);
    }
  };

  const handleDelete = async() => {
    try {
      if (note._id) { // Check if note._id is not undefined
        await deleteNote(note._id); // Pass only the ID
        refetch();
      } else {
        console.log("Error: Note ID is undefined");
      }
    } catch (error) {
      console.log("Error deleting note", error);
    }
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  console.log(note);

  return (
    <div>
      <h3>{note?.title}</h3>
      <p>{note?.content}</p>
      <button onClick={handleOpenModal}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "5px",
            maxWidth: "400px",
          }}
        >
          <h2>Edit Note</h2>
          <TextField
            label="Title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Content"
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Save
          </Button>
          <Button variant="contained" onClick={handleCloseModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default GetAllNotes;
