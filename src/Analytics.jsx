import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Analytics.css";
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
  Legend
} from "recharts";
const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6"
];



const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <h2>Loading Analytics...</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="analytics-loading">
        <h2>No Analytics Available</h2>
      </div>
    );
  }

  const {
    overview,
    priorities,
    categories,
    weeklyChart,
  } = data;
const pieData=[
    {
        name:"Completed",
        value:overview.completedTasks,
    },
    {
    name:"Pending",
    value:overview.pendingTasks,
    },
];

  return (
    <div className="analytics-container">

      <h1 className="analytics-title">
        📊 LifeSaver AI Analytics Dashboard
      </h1>

      {/* Overview */}

      <div className="card-grid">

        <div className="card">
          <h3>Total Tasks</h3>
          <h1>{overview.totalTasks}</h1>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h1>{overview.completedTasks}</h1>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <h1>{overview.pendingTasks}</h1>
        </div>

        <div className="card">
          <h3>Today's Tasks</h3>
          <h1>{overview.todayCompleted}</h1>
        </div>

        <div className="card productivity">
          <h3>Productivity</h3>

          <div className="progress-circle">
            {overview.productivity}%
          </div>

        </div>

      </div>
      <div className="chart-grid">

<div className="chart-card">

<h2>Task Distribution</h2>

<ResponsiveContainer
width="100%"
height={350}
>

<PieChart>

<Pie
data={pieData}
cx="50%"
cy="50%"
outerRadius={120}
dataKey="value"
label
>

{
pieData.map((entry,index)=>(
<Cell
key={index}
fill={COLORS[index % COLORS.length]}
/>
))
}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

<div className="chart-card">

<h2>Weekly Progress</h2>

<ResponsiveContainer
width="100%"
height={350}
>

<BarChart
data={weeklyChart}
>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="day"/>

<YAxis/>

<Tooltip/>

<Legend/>

<Bar
dataKey="completed"
fill="#3b82f6"
radius={[10,10,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

      {/* Priority */}

      <div className="analytics-section">

        <h2>Priority Analysis</h2>

        <table>

          <thead>
            <tr>
              <th>Priority</th>
              <th>Tasks</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>🔴 High</td>
              <td>{priorities.High}</td>
            </tr>

            <tr>
              <td>🟡 Medium</td>
              <td>{priorities.Medium}</td>
            </tr>

            <tr>
              <td>🟢 Low</td>
              <td>{priorities.Low}</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* Category */}

      <div className="analytics-section">

        <h2>Category Analysis</h2>

        <table>

          <thead>

            <tr>
              <th>Category</th>
              <th>Total</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td>📚 Study</td>
              <td>{categories.Study}</td>
            </tr>

            <tr>
              <td>💼 Work</td>
              <td>{categories.Work}</td>
            </tr>

            <tr>
              <td>🏠 Personal</td>
              <td>{categories.Personal}</td>
            </tr>

            <tr>
              <td>❤️ Health</td>
              <td>{categories.Health}</td>
            </tr>

            <tr>
              <td>📦 Other</td>
              <td>{categories.Other}</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* Weekly */}

      <div className="analytics-section">

        <h2>Weekly Progress</h2>

        <table>

          <thead>

            <tr>
              <th>Day</th>
              <th>Completed</th>
            </tr>

          </thead>

          <tbody>

            {weeklyChart.map((item, index) => (

              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.completed}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* AI */}

      <div className="analytics-section">

        <h2>🤖 AI Suggestions</h2>

        <ul className="tips">

          <li>Complete High Priority tasks first.</li>

          <li>Finish pending tasks before adding new ones.</li>

          <li>Maintain your productivity above 80%.</li>

          <li>Complete today's tasks to improve your streak.</li>

          <li>Keep consistency for better AI score.</li>

        </ul>

      </div>

    </div>
  );
};

export default Analytics;