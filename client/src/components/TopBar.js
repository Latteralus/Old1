import React from 'react';

const TopBar = ({ username = "Guest" }) => {
  const currentDateTime = new Date().toLocaleString();

  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <span className="game-title">PharmaSim</span>
        <div className="financial-summary">
          <span className="summary-item">Cash: $1000.00</span>
          <span className="summary-item">Income (Today): $200.00</span>
          <span className="summary-item">Pending Insurance: $150.00</span>
        </div>
        <div className="top-bar-right">
          <span>Logged in as: {username}</span>
          <span>{currentDateTime}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
