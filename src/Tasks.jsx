import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API, { createTask,getTasks } from "./services/api";
import { generateTaskPlan } from "./services/gemini";
import "./Tasks.css";

function Tasks() {
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  const [aiPlan, setAiPlan] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data=await getTasks();
      setTasks(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await createTask(
        {
          title,
          priority,
          category,
          dueDate,
        },
        token
      );

      setTitle("");
      setPriority("Medium");
      setCategory("Personal");
      setDueDate("");

      fetchTasks();
    } catch (err) {
        console.log("Add Task Error:");
      console.log(err.response?.data);
      console.log(err);
    }
  };

  const completeTask = async (id) => {
    try {
      await API.put(
        `/tasks/${id}`,
        {
          completed: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const generateAIPlan = async () => {
    if (tasks.length === 0) return;

    setGenerating(true);

    try {
      const result = await generateTaskPlan(
        tasks.map((task) => task.title)
      );

      setAiPlan(result);
    } catch (err) {
      console.log(err);
    } finally {
      setGenerating(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const titleMatch = (task.title || "" ).toLowerCase()
      .includes(search.toLowerCase());

    const priorityMatch =
      filterPriority === "All"
        ? true
        : task.priority === filterPriority;

    return titleMatch && priorityMatch;
  });

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = tasks.length - completed;

  const productivity =
    tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100);

  return (
    <div className="home-container">

      <nav>
        <div className="logo">LifeSaver AI</div>

        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/analytics">Analytics</Link></li>
        </ul>
      </nav>

      <section className="stats">

        <div className="card">
          <h2>{completed}</h2>
          <p>Completed</p>
        </div>

        <div className="card">
          <h2>{pending}</h2>
          <p>Pending</p>
        </div>

        <div className="card">
          <h2>{productivity}%</h2>
          <p>Productivity</p>
        </div>

      </section>

      <div className="task-grid">

        <div className="task-card">

          <h2>Today's Tasks</h2>

          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="row">

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Personal</option>
              <option>Work</option>
              <option>Study</option>
              <option>Health</option>
            </select>

          </div>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button
            className="start-btn"
            onClick={addTask}
          >
            Add Task
          </button>

          <hr />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h3>Loading Tasks...</h3>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                opacity: 0.8,
              }}
            >
              <h3>No Tasks Found</h3>
              <p>Add your first task to get started.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="task-item"
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  borderRadius: "14px",
                  background: "#1f2b55",
                }}
              >
                <h3>{task.title}</h3>

                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>

                <p>
                  <strong>Category:</strong> {task.category}
                </p>

                <p>
                  <strong>Due:</strong>{" "}
                  {task.dueDate
                    ? task.dueDate.substring(0, 10)
                    : "No Due Date"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {task.completed ? "Completed ✅" : "Pending ⏳"}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  {!task.completed && (
                    <button
                      className="start-btn"
                      onClick={() => completeTask(task._id)}
                    >
                      Complete
                    </button>
                  )}

                  <button
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}

        </div>

        <div className="task-card">

          <h2>AI Suggestions</h2>

          <p>
            Let Gemini AI organize your tasks into the most productive order.
          </p>

          <button
            className="start-btn"
            onClick={generateAIPlan}
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate AI Plan"}
          </button>

          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "12px",
              background: "#162447",
              minHeight: "300px",
            }}
          >
            {aiPlan ? (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                }}
              >
                {aiPlan}
              </pre>
            ) : (
              <p>
                Your AI-generated daily schedule will appear here.
              </p>
            )}
          </div>

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              borderRadius: "12px",
              background: "#1b2758",
            }}
          >
            <h3>Quick Summary</h3>

            <p>Total Tasks: {tasks.length}</p>

            <p>Completed: {completed}</p>

            <p>Pending: {pending}</p>

            <p>Productivity Score: {productivity}%</p>
          </div>

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              borderRadius: "12px",
              background: "#1b2758",
            }}
          >
            <h3>Today's Tips</h3>

            <ul>
              <li>Finish High Priority tasks first.</li>
              <li>Break large tasks into smaller goals.</li>
              <li>Keep 15 minutes for review.</li>
              <li>Complete pending tasks before adding new ones.</li>
              <li>Use AI suggestions to optimize your schedule.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Tasks;