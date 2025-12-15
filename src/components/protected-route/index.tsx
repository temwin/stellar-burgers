import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { selectIsAuthenticated } from '../../services/slices/authSlice';

export const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
