import { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import API from "./services/api";

const COLORS = ["#00E5FF", "#7C4DFF"];

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const total = tasks.length;

  const productivity =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const today = new Date().toDateString();

  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate).toDateString() === today;
  }).length;

  const streak = Math.min(completed, 30);

  const pieData = [
    {
      name: "Completed",
      value: completed,
    },
    {
      name: "Pending",
      value: pending,
    },
  ];

  const weeklyData = [
    { day: "Mon", completed: completed > 0 ? 2 : 0 },
    { day: "Tue", completed: completed > 1 ? 3 : 1 },
    { day: "Wed", completed: completed > 2 ? 4 : 2 },
    { day: "Thu", completed: completed > 3 ? 5 : 3 },
    { day: "Fri", completed: completed > 4 ? 4 : 2 },
    { day: "Sat", completed: completed > 5 ? 6 : 3 },
    { day: "Sun", completed },
  ];

  const upcoming = tasks
    .filter((t) => !t.completed && t.dueDate)
    .slice(0, 5);

  return (
    <div className="dashboard">

      <h1>LifeSaver AI Dashboard</h1>

      <div className="card-grid">

        <div className="card">
          <h3>Total Tasks</h3>
          <h1>{total}</h1>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h1>{completed}</h1>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <h1>{pending}</h1>
        </div>

        <div className="card">
          <h3>Today's Tasks</h3>
          <h1>{todayTasks}</h1>
        </div>

        <div className="card">
          <h3>Productivity</h3>
          <h1>{productivity}%</h1>
        </div>

        <div className="card">
          <h3>Daily Streak 🔥</h3>
          <h1>{streak} Days</h1>
        </div>

      </div>

      <div className="charts">

        <div className="chart">

          <h2>Task Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={110}
                label
              >

                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="chart">

          <h2>Weekly Progress</h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={weeklyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="completed"
                fill="#00E5FF"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="bottom">

        <div className="summary">

          <h2>AI Daily Summary</h2>

          <p>
            You completed <b>{completed}</b> out of{" "}
            <b>{total}</b> tasks today.

          </p>

          <p>

            Productivity Score :
            <b> {productivity}%</b>

          </p>

          <p>

            {productivity >= 80
              ? "Excellent work! Keep maintaining your streak."
              : productivity >= 50
              ? "Good progress. Complete a few more tasks today."
              : "Let's focus on completing your pending tasks."}

          </p>

        </div>

        <div className="summary">

          <h2>Upcoming Deadlines</h2>

          {upcoming.length === 0 ? (
            <p>No Upcoming Tasks 🎉</p>
          ) : (
            upcoming.map((task) => (
              <div key={task._id}>

                <strong>{task.title}</strong>

                <br />

                {new Date(task.dueDate).toLocaleDateString()}

                <hr />

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;