import {useNavigate} from 'react-router-dom';
import React from 'react';
import {authService} from '../../../services/authService';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
  }

  return (
      <div className="page-header">
        <h2>Expense Tracker</h2>
        <div className="page-header-actions">
          <button onClick={handleSettings} className="settings-button" title="Settings"/>
          <button onClick={handleLogout} className="logout-button" title="Logout"/>
        </div>
      </div>
  );
}

export default Header;