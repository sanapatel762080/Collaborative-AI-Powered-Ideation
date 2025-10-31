import React from "react";
import { useParams } from "react-router-dom";
import KanbanBoardWrapper from "./KanbanBoardWrapper";

export default function TasksPage() {
  const { id } = useParams(); // projectId from URL

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Project Tasks</h2>
      <KanbanBoardWrapper projectId={id} />
    </div>
  );
}
