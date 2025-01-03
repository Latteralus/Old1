import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css'; // Importing the associated CSS file for styling.

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redirect to logout route
    navigate('/logout');
  };

  return (
    <aside className="sidebar">
      <nav className="nav-links">
        <Link to="/operations" className="nav-item">
          Operations
        </Link>
        <Link to="/inventory" className="nav-item">
          Inventory
        </Link>
        <Link to="/marketplace" className="nav-item">
          Marketplace
        </Link>
        <Link to="/employees" className="nav-item">
          Employees
        </Link>
        <Link to="/finances" className="nav-item">
          Finances
        </Link>
        <Link to="/customers" className="nav-item">
          Customers
        </Link>
        <Link to="/orders" className="nav-item">
          Orders
        </Link>
        <Link to="/equipment" className="nav-item">
          Equipment
        </Link>
        <Link to="/research" className="nav-item">
          Research
        </Link>
        <Link to="/marketing" className="nav-item">
          Marketing
        </Link>
        <Link to="/statistics" className="nav-item">
          Statistics
        </Link>
      </nav>
      {/* Logout button */}
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;