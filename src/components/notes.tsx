import React, { useState, useEffect } from "react";
import { useCreateNotesMutation, useGetAllNotesQuery } from "../redux/notesApi";
import { Note } from "../types/types";
import GetAllNotes from "./getAllNotes";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const { data, refetch } = useGetAllNotesQuery();
  const [createNote] = useCreateNotesMutation();

  useEffect(() => {
    if (data) {
      setNotes(data?.notes); // Wrap data.notes in an array
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await createNote({ title, content });
      refetch()
      setTitle("");
      setContent("");
    } catch (error) {
      console.log("Error creating note", error);
    }
  };
  console.log(notes)
  return (
    <div>
      <h4>{JSON.stringify(notes)}</h4>
      <div>
        <form onSubmit={handleSubmit}>
          <h2>Create Notes</h2>
          <label>Title</label>
          <input
            type="text"
            required
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Content</label>
          <input
            type="text"
            required
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button type="submit">Create</button>
        </form>
      </div>

      {notes && notes.map((note) => (
        <GetAllNotes note={note} key={note._id}/>
      ))}
    </div>
  );
};

export default Notes;
