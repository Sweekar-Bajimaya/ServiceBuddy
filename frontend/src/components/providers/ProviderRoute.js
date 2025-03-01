import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProviderRoute = () => {
  const { user } = useContext(AuthContext);
  if (!user || user.user_type !== 'provider') {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProviderRoute;
