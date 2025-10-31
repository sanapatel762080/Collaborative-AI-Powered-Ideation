import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";

import KanbanBoard from "../Tasks/KanbanBoard";
import WhiteboardWrapper from "../Whiteboard/WhiteboardWrapper";
import Notes from "../Notes/Notes";
import AnalyticsDashboard from "../Analytics/AnalyticsDashboard";
import AIChat from "../AIChat/AIChat";

export default function ProjectDashboard() {
  const { id } = useParams(); // projectId from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "tasks";
  const [key, setKey] = useState(initialTab);

  // Update URL when tab changes
  const handleTabSelect = (k) => {
    setKey(k);
    setSearchParams({ tab: k });
  };

  // Sync key if URL changes manually
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== key) setKey(tabParam);
  }, [searchParams]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Project Dashboard</h2>

      <Tabs id="project-tabs" activeKey={key} onSelect={handleTabSelect} className="mb-3" justify>
        <Tab eventKey="tasks" title="Tasks">
          <div style={{ minHeight: "80vh" }}>
            <KanbanBoard projectId={id} />
          </div>
        </Tab>
        <Tab eventKey="whiteboard" title="Whiteboard">
          <div style={{ minHeight: "80vh" }}>
            <WhiteboardWrapper projectId={id} />
          </div>
        </Tab>
        <Tab eventKey="notes" title="Notes">
          <div style={{ minHeight: "80vh" }}>
            <Notes projectId={id} />
          </div>
        </Tab>
        <Tab eventKey="analytics" title="Analytics">
          <div style={{ minHeight: "80vh" }}>
            <AnalyticsDashboard projectId={id} active={key === "analytics"} />
          </div>
        </Tab>
        <Tab eventKey="ai-ideation" title="AI Ideation">
          <div style={{ minHeight: "80vh" }}>
            <AIChat projectId={id} active={key === "ai-ideation"} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
