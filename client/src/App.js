import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import OperationsPage from './pages/OperationsPage';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on initial load
    const authStatus = window.sessionStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  // Handle authentication state changes
  const handleLogin = () => {
    window.sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div id="app-container" style={{ height: '100vh' }}>
        {isAuthenticated ? (
          <div id="authenticated-root" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Top Navigation Bar */}
            <TopBar onLogout={handleLogout} />

            <div style={{ display: 'flex', flex: 1 }}>
              {/* Sidebar Navigation */}
              <Sidebar />

              {/* Main Content Area */}
              <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                <Routes>
                  <Route path="/operations" element={<OperationsPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="*" element={<Navigate to="/operations" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <div id="unauthenticated-root" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Routes>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
