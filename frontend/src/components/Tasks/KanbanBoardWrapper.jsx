import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";

export default function KanbanBoardWrapper({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId; // Update status
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);

    // Persist status change
    axios.put(`http://localhost:5000/api/tasks/${movedTask._id}`, movedTask)
      .catch(err => console.error(err));
  };

  const handleAddTask = () => {
    setEditTask(null);
    setTaskTitle("");
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setTaskTitle(task.title);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTask = async () => {
    try {
      if (editTask) {
        // Update
        const res = await axios.put(`http://localhost:5000/api/tasks/${editTask._id}`, { ...editTask, title: taskTitle });
        setTasks(tasks.map(t => t._id === res.data._id ? res.data : t));
      } else {
        // Create
        const newTask = { title: taskTitle, project: projectId, status: "To Do" };
        const res = await axios.post("http://localhost:5000/api/tasks", newTask);
        setTasks([...tasks, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const statuses = ["To Do", "In Progress", "Done"];

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <h5>Kanban Tasks</h5>
        <Button onClick={handleAddTask}>+ Add Task</Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="d-flex gap-3">
          {statuses.map(status => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ minHeight: 400, padding: 10, flex: 1, border: "1px solid #ccc", borderRadius: 5 }}
                >
                  <h6 className="text-center">{status}</h6>
                  {tasks.filter(t => t.status === status).map((task, idx) => (
                    <Draggable key={task._id} draggableId={task._id} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: 8,
                            marginBottom: 8,
                            background: "#f8f9fa",
                            borderRadius: 4,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                            ...provided.draggableProps.style
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{task.title}</span>
                            <div>
                              <Button size="sm" variant="outline-secondary" onClick={() => handleEditTask(task)}>✏️</Button>{" "}
                              <Button size="sm" variant="outline-danger" onClick={() => handleDeleteTask(task._id)}>🗑️</Button>
                            </div>
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

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editTask ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveTask}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
