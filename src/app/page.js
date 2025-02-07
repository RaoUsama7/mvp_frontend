'use client';

import React, { useState } from 'react';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard';


const Home = () => {
  const [activeComponent, setActiveComponent] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderContent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Projects':
        return <ProjectManagement />;
      case 'Profile':
        return <Profile/>
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div
        className="flex-1 overflow-y-auto p-6 bg-gray-100"
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;
