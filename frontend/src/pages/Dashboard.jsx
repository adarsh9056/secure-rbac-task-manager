import { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../api";
import { clearSession, isTokenExpired } from "../utils/auth";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      if (!token || isTokenExpired(token)) {
        clearSession();
        window.location.href = "/login";
        return;
      }
      const result = await getTasks(token);
      setTasks(result.data || []);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      if (error.message.toLowerCase().includes("token")) {
        clearSession();
        window.location.href = "/login";
      }
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
    setSaving(true);
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
    } finally {
      setSaving(false);
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
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (!isConfirmed) return;
    try {
      await deleteTask(token, taskId);
      setMessage({ type: "success", text: "Task deleted successfully" });
      await loadTasks();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const onLogout = () => {
    clearSession();
    window.location.href = "/login";
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {message.text ? (
        <div
          className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-2 text-white shadow-lg ${
            message.type === "error" ? "bg-red-500" : "bg-emerald-500"
          }`}
        >
          {message.text}
        </div>
      ) : null}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-3xl font-semibold">Task Dashboard</h1>
          <p className="text-slate-600 text-sm mt-1">
            Logged in as <strong>{user?.name || "Unknown"}</strong> ({user?.role || "user"})
          </p>
        </div>
        <button className="bg-slate-700 hover:bg-slate-800 text-white rounded-lg px-4 py-2" onClick={onLogout}>
          Logout
        </button>
      </div>

      <form className="bg-white rounded-2xl shadow p-4 sm:p-5 mb-5" onSubmit={onCreateOrUpdate}>
        <h2 className="text-xl font-semibold mb-3">{editingId ? "Edit Task" : "Create Task"}</h2>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-3 min-h-24"
          name="description"
          placeholder="Task description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Task" : "Add Task"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="bg-slate-600 hover:bg-slate-700 text-white rounded-lg px-4 py-2"
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

      <div className="grid gap-3">
        {loading ? (
          <p className="text-slate-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-slate-500">No tasks yet. Add your first task.</p>
        ) : (
          tasks.map((task) => (
            <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4" key={task._id}>
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-slate-600">{task.description || "No description"}</p>
                <small className={`${task.completed ? "text-emerald-600" : "text-amber-600"}`}>
                  {task.completed ? "Completed" : "Pending"}
                </small>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="bg-slate-700 hover:bg-slate-800 text-white rounded-lg px-3 py-2" onClick={() => onToggleComplete(task)}>
                  {task.completed ? "Mark Pending" : "Mark Done"}
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2" onClick={() => onEdit(task)}>
                  Edit
                </button>
                {user?.role === "admin" ? (
                  <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2" onClick={() => onDelete(task._id)}>
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
