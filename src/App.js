import React, { useState, useReducer } from "react";
import { v4 as uuid } from "uuid";

const initialNotesState = {
  lastNoteCreated: null,
  totalNotes: 0,
  notes: [],
};

const notesReducer = (prevState, action) => {
  switch (action.type) {
    case "ADD_NOTE": {
      const newState = {
        notes: [...prevState.notes, action.payload],
        totalNotes: prevState.notes.length + 1,
        lastNoteCreated: new Date().toTimeString().slice(0, 8),
      };

      return newState;
    }

    case "DELETE_NOTE": {
      const newState = {
        ...prevState,
        notes: prevState.notes.filter((note) => note.id !== action.payload.id),
        totalNotes: prevState.notes.length - 1,
      };
      console.log("After DELETE_NOTE: ", newState);
      return newState;
    }
  }
};

export function App() {
  const [notesState, dispatch] = useReducer(notesReducer, initialNotesState);
  const [noteInput, setNoteInput] = useState("");
  const colors = ["#DDF7E3", "#F5FFC9", "#B4E4FF", "#FEFBE9"];

  const addNote = (event) => {
    event.preventDefault();
    if (!noteInput) {
      return;
    }

    const newNote = {
      id: uuid(),
      text: noteInput,
      rotate: Math.floor(Math.random() * 20),
    };

    dispatch({ type: "ADD_NOTE", payload: newNote });
    setNoteInput("");
  };

  const dragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const dropNote = (event) => {
    event.target.style.left = `${event.pageX - 50}px`;
    event.target.style.top = `${event.pageY - 50}px`;
  };

  return (
    <div className="app" onDragOver={dragOver}>
      <div className="top">
        <div className="head">
          <h1>
            Sticky Notes ({notesState.totalNotes})
            <span>
              {notesState.notes.length
                ? `Last note created: ${notesState.lastNoteCreated}`
                : " "}
            </span>
          </h1>
        </div>
        <div className="middle">
          <form className="note-form" onSubmit={addNote}>
            <textarea
              placeholder="Create a new note..."
              value={noteInput}
              onChange={(event) => setNoteInput(event.target.value)}
            ></textarea>
            <button>Add</button>
          </form>
        </div>
        <div className="bottom">
          {notesState.notes.map((note, index) => {
            return (
              <div
                className="note"
                onDragEnd={dropNote}
                draggable="true"
                style={{ backgroundColor: colors[index % 4] }}
                key={note.id}
              >
                <div
                  onClick={() =>
                    dispatch({ type: "DELETE_NOTE", payload: note })
                  }
                  className="close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <pre className="text">{note.text}</pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
