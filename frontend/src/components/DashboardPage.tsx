// frontend/src/components/DashboardPage.tsx
import React from 'react';

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <div className="hero-section">
        <h1 className="gradient-text">Manage your tasks</h1>
        <p>Organize your work and life with our intuitive task manager</p>
      </div>
      
      <div className="dashboard-content">
        <div className="task-dashboard-card">
          <div className="icon">📋</div>
          <h2>Task Management Dashboard</h2>
          <p>Visual representation of your tasks</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;