import {Navigate} from 'react-router-dom';
import {authService} from '../services/authService';
import React from "react";

function ProtectedRoute({children}: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace/>;
  }

  return children;
}

export default ProtectedRoute;