import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsDashboard({ projectId, active }) {
  const [projectStats, setProjectStats] = useState({
    tasksCompleted: 0,
    tasksPending: 0,
    activeUsers: 0,
    totalProjects: 0,
    ideas: 0,
    notes: 0,
    messages: 0,
  });

  const [taskTrends, setTaskTrends] = useState([]);
  const [aiInsights, setAiInsights] = useState("Loading AI insights...");

  const fetchAnalytics = async () => {
    if (!projectId) return;

    try {
      // 📊 Project Stats
      const statsRes = await fetch(`http://localhost:5000/api/analytics/project/${projectId}`);
      const statsData = await statsRes.json();
      setProjectStats(statsData);

      // 📈 Task Trends
      const trendsRes = await fetch(`http://localhost:5000/api/analytics/project/${projectId}/trends`);
      const trendsData = await trendsRes.json();
      setTaskTrends(trendsData);

      // 🤖 AI Insights
      const aiRes = await fetch(`http://localhost:5000/api/analytics/project/${projectId}/ai`);
      const aiData = await aiRes.json();

      if (aiData && aiData.insights) {
        const formatted =
          Array.isArray(aiData.insights) && aiData.insights.length > 0
            ? aiData.insights.map((i) => `• ${i}`).join("\n")
            : typeof aiData.insights === "string"
            ? aiData.insights
            : "No AI insights available.";
        setAiInsights(formatted);
      } else {
        setAiInsights("No AI insights available.");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setAiInsights("⚠️ Failed to load AI insights.");
    }
  };

  useEffect(() => {
    if (active) {
      fetchAnalytics();
    }
  }, [projectId, active]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📊 Analytics Dashboard</h2>

      {/* Top Stats Cards */}
      <div className="row mb-4">
        {[
          { label: "Completed Tasks", value: projectStats.tasksCompleted, color: "success" },
          { label: "Pending Tasks", value: projectStats.tasksPending, color: "warning" },
          { label: "Active Users", value: projectStats.activeUsers, color: "info" },
          { label: "Projects", value: projectStats.totalProjects, color: "primary" },
        ].map((stat, i) => (
          <div className="col-md-3 mb-3" key={i}>
            <div className={`card text-center border-${stat.color}`}>
              <div className="card-body">
                <h4 className={`text-${stat.color}`}>{stat.value}</h4>
                <p>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row">
        {/* Line Chart - Task Trends */}
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm">
            <h5>📈 Task Trends (This Week)</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={taskTrends}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#28a745" />
                <Line type="monotone" dataKey="pending" stroke="#ffc107" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Task Distribution */}
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm">
            <h5>📌 Task Distribution</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Completed", value: projectStats.tasksCompleted },
                    { name: "Pending", value: projectStats.tasksPending },
                  ]}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#28a745" />
                  <Cell fill="#ffc107" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="card p-3 shadow-sm mt-4">
        <h5>🤖 AI Insights (Powered by Gemini)</h5>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "15px" }}>{aiInsights}</pre>
      </div>

      {/* Additional Stats */}
      <div className="row mt-4">
        {[
          { label: "Ideas", value: projectStats.ideas, color: "primary" },
          { label: "Notes", value: projectStats.notes, color: "secondary" },
          { label: "Messages", value: projectStats.messages, color: "info" },
        ].map((stat, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <div className={`card text-center border-${stat.color}`}>
              <div className="card-body">
                <h4 className={`text-${stat.color}`}>{stat.value}</h4>
                <p>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
