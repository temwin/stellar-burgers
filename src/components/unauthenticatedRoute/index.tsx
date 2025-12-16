import { useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import { ReactElement } from 'react';
import { selectIsAuthenticated } from '../../services/slices/authSlice';

export const UnauthenticatedRoute = ({
  children
}: {
  children: ReactElement;
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
};
