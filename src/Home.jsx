import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import API from "./services/api";

function Home() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  const productivityScore =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  return (
    <>
      <div className="background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav>
        <div className="logo">MOMENTUM</div>

        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li>
            <Link to="/tasks">Tasks</Link>
          </li>

          <li>
            <Link to="/analytics">Analytics</Link>
          </li>
        </ul>

        <button
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <h1>
            AI Productivity
            <span> Companion</span>
          </h1>

          <p>
            Stop missing deadlines.
            Let AI plan, prioritize and complete your tasks intelligently.
          </p>

          <button
            className="start-btn"
            onClick={() => navigate("/tasks")}
          >
            Get Started
          </button>
        </div>

        <div className="hero-right">
          <div className="ai-orb"></div>
        </div>
      </section>

      <section className="stats">
        <div className="card">
          <h2>{completedTasks}</h2>
          <p>Tasks Completed</p>
        </div>

        <div className="card">
          <h2>{pendingTasks}</h2>
          <p>Pending Tasks</p>
        </div>

        <div className="card">
          <h2>{productivityScore}%</h2>
          <p>Productivity Score</p>
        </div>
      </section>
    </>
  );
}

export default Home;