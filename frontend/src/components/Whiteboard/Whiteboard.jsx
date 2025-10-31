import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { AuthContext } from "../../context/AuthContext";

export default function Whiteboard({ projectId }) {
  const { user } = useContext(AuthContext); // get current user
  const [elements, setElements] = useState([]);
  const [selectedTool, setSelectedTool] = useState("sticky");
  const [textInput, setTextInput] = useState("");
  const [cursors, setCursors] = useState({});
  const socketRef = useRef(null);
  const boardRef = useRef(null);

  // Check if user can edit this project
  const canEdit = user?.projects?.includes(projectId) || user?.role === "ADMIN";

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    const socket = socketRef.current;

    socket.emit("joinWhiteboard", { projectId });

    socket.on("whiteboardUpdate", (data) => setElements(data));
    socket.on("cursorUpdate", (data) => setCursors(data));

    if (canEdit) {
      const handleMouseMove = (e) => {
        const rect = boardRef.current.getBoundingClientRect();
        const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        socket.emit("cursorMove", { projectId, pos });
      };
      boardRef.current.addEventListener("mousemove", handleMouseMove);

      return () => {
        boardRef.current?.removeEventListener("mousemove", handleMouseMove);
        socket.disconnect();
      };
    } else {
      return () => socket.disconnect();
    }
  }, [projectId, canEdit, user]);

  const syncElements = (newElements) => {
    setElements(newElements);
    socketRef.current.emit("updateWhiteboard", { projectId, elements: newElements });
  };

  const addElement = () => {
    if (!canEdit) return alert("You cannot edit this whiteboard!");
    if (!textInput.trim()) return;

    const newEl = {
      id: Date.now(),
      type: selectedTool,
      text: textInput,
      x: 50,
      y: 50,
      color: selectedTool === "sticky" ? "#fffb88" : "#90ee90",
    };
    syncElements([...elements, newEl]);
    setTextInput("");
  };

  const deleteElement = (id) => {
    if (!canEdit) return alert("You cannot delete elements!");
    const filtered = elements.filter((el) => el.id !== id);
    syncElements(filtered);
  };

  const handleDrag = (id, e) => {
    if (!canEdit) return;
    const newElements = elements.map((el) =>
      el.id === id ? { ...el, x: e.clientX - 100, y: e.clientY - 50 } : el
    );
    syncElements(newElements);
  };

  const exportAsImage = async () => { /* same as before */ };
  const exportAsPDF = async () => { /* same as before */ };

  return (
    <div className="container mt-3">
      <h3>📌 Whiteboard</h3>

      <div className="d-flex mb-2 gap-2">
        <DropdownButton title={`Tool: ${selectedTool}`} onSelect={(val) => setSelectedTool(val)} disabled={!canEdit}>
          <Dropdown.Item eventKey="sticky">Sticky Note</Dropdown.Item>
          <Dropdown.Item eventKey="shape">Shape</Dropdown.Item>
        </DropdownButton>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Text for element..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          disabled={!canEdit}
        />
        <Button onClick={addElement} disabled={!canEdit}>Add</Button>
        <Button variant="success" onClick={exportAsImage}>Export PNG</Button>
        <Button variant="secondary" onClick={exportAsPDF}>Export PDF</Button>
      </div>

      <div
        ref={boardRef}
        className="border rounded position-relative"
        style={{ height: "70vh", background: "#f4f4f4", overflow: "hidden" }}
      >
        {elements.map((el) => (
          <div
            key={el.id}
            className="position-absolute p-2"
            style={{ left: el.x, top: el.y, backgroundColor: el.color, minWidth: "80px", cursor: canEdit ? "move" : "default", borderRadius: "4px" }}
            onMouseDown={(e) => canEdit && handleDrag(el.id, e)}
          >
            <div className="d-flex justify-content-between align-items-center">
              <span>{el.text}</span>
              {canEdit && <Button size="sm" variant="danger" onClick={() => deleteElement(el.id)}>&times;</Button>}
            </div>
          </div>
        ))}

        {Object.entries(cursors).map(([userId, pos]) => (
          <div
            key={userId}
            className="position-absolute"
            style={{ left: pos.x, top: pos.y, width: "10px", height: "10px", backgroundColor: "red", borderRadius: "50%", pointerEvents: "none" }}
            title={userId}
          ></div>
        ))}
      </div>
    </div>
  );
}
