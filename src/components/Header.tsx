import {useNavigate} from 'react-router-dom';
import React from 'react';
import {authService} from '../services/authService';
import './Header.css';

type Props = {
  title: string;
}

function Header({title}: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
      <div className="expenses-header">
        <h2>{title}</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
  );
}

export default Header;