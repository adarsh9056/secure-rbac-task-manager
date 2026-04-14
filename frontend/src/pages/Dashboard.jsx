import { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const loadTasks = async () => {
    try {
      const result = await getTasks(token);
      setTasks(result.data || []);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const onCreateOrUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      if (editingId) {
        await updateTask(token, editingId, form);
        setMessage({ type: "success", text: "Task updated successfully" });
      } else {
        await createTask(token, form);
        setMessage({ type: "success", text: "Task created successfully" });
      }
      setForm({ title: "", description: "" });
      setEditingId(null);
      await loadTasks();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const onEdit = (task) => {
    setEditingId(task._id);
    setForm({ title: task.title, description: task.description || "" });
  };

  const onToggleComplete = async (task) => {
    try {
      await updateTask(token, task._id, { completed: !task.completed });
      await loadTasks();
      setMessage({ type: "success", text: "Task status updated" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const onDelete = async (taskId) => {
    try {
      await deleteTask(token, taskId);
      setMessage({ type: "success", text: "Task deleted successfully" });
      await loadTasks();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-wrap">
      <div className="dashboard-header">
        <div>
          <h1>Task Dashboard</h1>
          <p>
            Logged in as <strong>{user?.name || "Unknown"}</strong> ({user?.role || "user"})
          </p>
        </div>
        <button className="secondary" onClick={onLogout}>
          Logout
        </button>
      </div>

      <form className="card task-form" onSubmit={onCreateOrUpdate}>
        <h2>{editingId ? "Edit Task" : "Create Task"}</h2>
        <input
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
        <textarea
          name="description"
          placeholder="Task description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        <div className="row">
          <button type="submit">{editingId ? "Update Task" : "Add Task"}</button>
          {editingId ? (
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ title: "", description: "" });
              }}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      {message.text ? <p className={message.type}>{message.text}</p> : null}

      <div className="task-list">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet. Add your first task.</p>
        ) : (
          tasks.map((task) => (
            <div className="card task-item" key={task._id}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description || "No description"}</p>
                <small>{task.completed ? "Completed" : "Pending"}</small>
              </div>
              <div className="row">
                <button className="secondary" onClick={() => onToggleComplete(task)}>
                  {task.completed ? "Mark Pending" : "Mark Done"}
                </button>
                <button className="secondary" onClick={() => onEdit(task)}>
                  Edit
                </button>
                <button className="danger" onClick={() => onDelete(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
