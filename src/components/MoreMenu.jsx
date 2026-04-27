import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, History, Settings, ChevronRight, RefreshCw } from 'lucide-react';

export default function MoreMenu() {
  const menuItems = [
    {
      to: "/report",
      icon: <FileText size={24} />,
      title: "Daily Report",
      subtitle: "End of day summary & closing"
    },
    {
      to: "/logs",
      icon: <History size={24} />,
      title: "Purchase Logs",
      subtitle: "View and edit transaction history"
    },
    {
      to: "/settings",
      icon: <Settings size={24} />,
      title: "Menu & Settings",
      subtitle: "Prices and commission rates"
    },
    {
      to: "/updates",
      icon: <RefreshCw size={24} />,
      title: "App Updates",
      subtitle: "Check and install OTA updates"
    }
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>More Options</h1>
        <p className="subtitle">Administrative and review tools.</p>
      </header>

      <div className="scrollable-content">
        <div className="more-menu-list">
          {menuItems.map((item, index) => (
            <NavLink 
              key={index} 
              to={item.to} 
              className="more-menu-item"
            >
              <div className="item-icon-wrapper">
                {item.icon}
              </div>
              <div className="item-text">
                <span className="item-title">{item.title}</span>
                <span className="item-subtitle">{item.subtitle}</span>
              </div>
              <ChevronRight className="item-chevron" size={20} />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
