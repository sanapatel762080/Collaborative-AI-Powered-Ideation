import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // Create new task
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/tasks", {
        title: newTaskTitle,
        project: projectId,
        status: "To Do",
      });
      setTasks([...tasks, res.data]);
      setNewTaskTitle("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Drag & Drop handler
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const task = tasks.find((t) => t._id === draggableId);
    const updatedTask = { ...task, status: destination.droppableId };

    try {
      await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, updatedTask);

      // Update local state
      const newTasks = tasks.map((t) => (t._id === draggableId ? updatedTask : t));
      setTasks(newTasks);
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const statuses = ["To Do", "In Progress", "Done"];

  return (
    <div>
      {/* Add new task */}
      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          placeholder="New Task Title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="d-flex gap-3">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="border rounded p-2 flex-grow-1"
                  style={{ minHeight: "400px", backgroundColor: "#f8f9fa" }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h5>{status}</h5>
                  {tasks
                    .filter((t) => t.status === status)
                    .map((task, index) => (
                      <Draggable draggableId={task._id} index={index} key={task._id}>
                        {(provided) => (
                          <div
                            className="card mb-2"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="card-body p-2">
                              <strong>{task.title}</strong>
                              {task.description && <p className="mb-0">{task.description}</p>}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
