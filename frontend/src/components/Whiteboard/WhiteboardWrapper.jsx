import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { io } from "socket.io-client";

export default function WhiteboardWrapper({ projectId }) {
  const [elements, setElements] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // pen, rect, circle
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [cursors, setCursors] = useState({}); // { socketId: {x, y} }
  const stageRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.emit("joinWhiteboard", { projectId });

    socketRef.current.on("whiteboardUpdate", (updatedElements) => {
      setElements(updatedElements);
    });

    // Cursor updates from other users
    socketRef.current.on("cursorUpdate", (cursorData) => {
      setCursors((prev) => ({ ...prev, ...cursorData }));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [projectId]);

  const handleMouseDown = (e) => {
    if (tool === "pen") {
      setIsDrawing(true);
      const stage = stageRef.current.getStage();
      const pos = stage.getPointerPosition();
      setElements([...elements, { type: "line", points: [pos.x, pos.y], stroke: color, strokeWidth: lineWidth }]);
    }
  };

  const handleMouseMove = (e) => {
    const stage = stageRef.current.getStage();
    const pos = stage.getPointerPosition();

    // Emit cursor position to server
    socketRef.current.emit("cursorMove", { projectId, pos });

    if (!isDrawing) return;
    if (tool === "pen") {
      const lastIndex = elements.length - 1;
      const lastElement = elements[lastIndex];
      lastElement.points = [...lastElement.points, pos.x, pos.y];
      setElements([...elements]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      socketRef.current.emit("updateWhiteboard", { projectId, elements });
    }
  };

  const handleClear = () => {
    setElements([]);
    socketRef.current.emit("updateWhiteboard", { projectId, elements: [] });
  };

  return (
    <div>
      <div className="mb-2 d-flex gap-2">
        <select value={tool} onChange={(e) => setTool(e.target.value)}>
          <option value="pen">Pen</option>
          <option value="rect">Rectangle</option>
          <option value="circle">Circle</option>
        </select>

        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="number" min={1} max={10} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
        <button className="btn btn-sm btn-danger" onClick={handleClear}>Clear</button>
      </div>

      <Stage
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 0.7}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid #ccc", background: "#fff" }}
      >
        <Layer>
          {elements.map((el, idx) => (
            el.type === "line" ? (
              <Line key={idx} points={el.points} stroke={el.stroke} strokeWidth={el.strokeWidth} tension={0.5} lineCap="round" />
            ) : null
          ))}

          {/* Render other users' cursors */}
          {Object.entries(cursors).map(([socketId, pos]) => (
            <Circle key={socketId} x={pos.x} y={pos.y} radius={5} fill="red" />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
