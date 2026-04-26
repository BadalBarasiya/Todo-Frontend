import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/getTask", "GET");
      setTasks(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchTasks);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await apiRequest("/createTask", "POST", { title: title.trim() });
      setTitle("");
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggle = async (task) => {
    try {
      await apiRequest("/updateTask", "POST", {
        id: task._id,
        title: task.title,
        completed: !task.completed,
      });
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateTask = async (id) => {
    if (!editingTitle.trim()) return;

    try {
      await apiRequest("/updateTask", "POST", {
        id,
        title: editingTitle.trim(),
      });
      setEditingId("");
      setEditingTitle("");
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await apiRequest("/deleteTask", "PUT", { id });
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-10">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Todo Dashboard</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </form>

        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add your first task.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="border rounded-lg p-3 flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task)}
                  className="w-4 h-4"
                />

                {editingId === task._id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-purple-300"
                  />
                ) : (
                  <span
                    className={`flex-1 ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                )}

                {editingId === task._id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateTask(task._id)}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId("");
                        setEditingTitle("");
                      }}
                      className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(task._id);
                        setEditingTitle(task.title);
                      }}
                      className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}