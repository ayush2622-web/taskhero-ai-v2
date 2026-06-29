import{useNavigate} from "react-router-dom";
import{ generateTaskPlan} from "./services/gemini";
import { useState, useEffect } from "react";
import "./App.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import API from "./services/api";
function Home() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const[priority,setPriority]=useState("Medium");
  const[aiSuggestion,setAiSuggestion]=useState("");
  const[loading, setLoading]=useState(false);
  const navigate=useNavigate();
  const[dueDate,setDueDate]=useState();
  const [events, setEvents]=useState([]);
  const completedTasks = tasks.filter(task => task.completed).length;

const pendingTasks = tasks.filter(task => !task.completed).length;

const productivityScore =
  tasks.length === 0
    ? 0
    : Math.round((completedTasks / tasks.length) * 100);
  const loadTasks = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await API.get("/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks(response.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  loadTasks();
}, []);
  const handleGeneratePlan = async () => {
  try {
    const taskNames=tasks.map(task => `${task.text}-${task.priority}`);

    const response = await generateTaskPlan(taskNames);
  
    setAiSuggestion(response);
  } catch (error) {
    console.error(error);
    setAiSuggestion("Failed to generate AI plan.");
  } finally{
    setLoading(false);
  }

};

    return(
        <>
        <div className="background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav>
        <div className="logo">
          LifeSaver AI
        </div>

        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Tasks</a></li>
          <li><a href="#">Calendar</a></li>
          <li><a href="#">Analytics</a></li>
        </ul>

        <button className="login-btn"
        onClick={()=> navigate("/login")}>
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

          <button className="start-btn">
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

      <section className="dashboard">

        <div className="task-panel glass">
          <h2>Today's Tasks</h2>

          <input
            type="text"
            placeholder="Add new task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <select
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
>
  <option value="High">High Priority</option>
  <option value="Medium">Medium Priority</option>
  <option value="Low">Low Priority</option>
</select>
<input
            type="date"
            value={dueDate || ""}
            onChange={(e) => setDueDate(e.target.value)}
            />
           <button
            className="start-btn"
            onClick={async () => {
  if (taskInput.trim() === "") return;

  try {
    const token = localStorage.getItem("token");

    const response = await API.post(
      "/tasks",
      {
        text: taskInput,
        priority,
        dueDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks([...tasks, response.data]);

    setTaskInput("");
    setPriority("Medium");
    setDueDate("");

  } catch (err) {
    console.error(err);
  }
}}
          >
            
            Add Task
          </button>

          <ul className="task-list">
            {tasks.map((task, index) => (
              <li key={index} className="task-item">

                <span
                  style={{
                    textDecoration: task.completed
                      ? "line-through"
                      : "none",
                    opacity: task.completed ? 0.6 : 1,
                  }}
                >
                  {task.text}
                </span>
                <p className="task-date-display">
                  {task.dueDate || "No Due Date"}
                </p>

                <div>
                  <button
                    className="complete-btn"
                    onClick={async () => {
                      console.log("Complete button clicked",task._id);
  try {
    const token = localStorage.getItem("token");
    console.log(task);

    const response = await API.put(
      `/tasks/${task._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks(
      tasks.map((t) =>
        t._id === task._id ? response.data : t
      )
    );
  } catch (err) {
    console.error(err);
  }
}}
                  >
                    Complete
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => {
                      setTasks(
                        tasks.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    ✕
                  </button>
                </div>
                

              </li>
            ))}
          </ul>
          <div className="calendar-section">
         < FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  headerToolbar={{
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  }}
  editable={true}
  selectable={true}
  events={events}
  dateClick={(info) => {
    const title = prompt("Enter Task");
    if (title) {
      setEvents([
        ...events,
        {
          title,
          start: info.dateStr,
          allDay: true,
        },
      ]);
    }
  }}
/>
</div>

        </div>

        <div className="ai-panel glass">
          <h2>AI Suggestions</h2>
          <div className="ai-output">
          <pre>{aiSuggestion}</pre>
          </div>

          <p>
            {aiSuggestion ||"Focus on Project Report.Deadline is within 24 hours."}

          </p>
          
          <button onClick={handleGeneratePlan}>
            {loading ?"Thinking..." : "Generate Smart Plan"}
            Generate Smart Plan
          </button>
        </div>

      </section>
      
    </>
    );
}
export default Home;