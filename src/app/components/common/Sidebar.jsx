import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMenu, FiHome, FiSettings, FiFolder, FiLogOut } from 'react-icons/fi';

// interface SidebarProps {
//   setActiveComponent: (component: string) => void;
//   activeComponent: string;
//   isCollapsed: boolean;
//   toggleSidebar: () => void;
// }

const Sidebar = ({ setActiveComponent, activeComponent, isCollapsed, toggleSidebar }) => {
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: FiHome },
    { name: 'Weeks', icon: FiFolder },
    { name: 'Lessons', icon: FiFolder },
    { name: 'Activities', icon: FiFolder },
    { name: 'Notifications', icon: FiFolder },
    // { name: 'Logout', icon: FiLogOut },
  ];

  const handleItemClick = (itemName) => {
    if (itemName === 'Weeks') {
      router.push('/weeks');
    } else {
      setActiveComponent(itemName);
    }
    if (itemName === 'Lessons') {
      router.push('/lessons');
    } else {
      setActiveComponent(itemName);
    }
    if (itemName === 'Activities') {
      router.push('/activities');
    } else {
      setActiveComponent(itemName);
    }
    if (itemName === 'Notifications') {
      router.push('/notifications');
    } else {
      setActiveComponent(itemName);
    }
  };

  return (
    <div
      className={`h-full transition-all duration-300 bg-white border-r ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="text-xl font-bold">TalkieTotz</h2>}
        <button
          onClick={toggleSidebar}
          className="text-gray-800 focus:outline-none"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleItemClick(item.name)}
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'space-x-4'
            } w-full px-4 py-2 text-gray-800 rounded-md transition-all ${
              activeComponent === item.name ? 'bg-neutral-200' : 'hover:bg-gray-100'
            }`}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
