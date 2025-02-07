'use client';
import React from 'react';
import GreetingBanner from './GreetingBanner';

const Dashboard = () => {
  
  return (
    <div className="flex flex-col">
      <GreetingBanner />
      <h1 className="mt-4 text-2xl sm:text-2xl font-bold">Recent Activities</h1>
      
    </div>
  );
};

export default Dashboard;
