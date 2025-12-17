import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement, useEffect, useState } from 'react';
import { selectIsAuthenticated } from '../../services/slices/authSlice';
import { Preloader } from '../ui/preloader';
import { useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/authSlice';
import { getCookie } from '../../utils/cookie';

export const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getCookie('accessToken');

      if (accessToken && !isAuthenticated) {
        try {
          await dispatch(getUser()).unwrap();
        } catch (error) {}
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (isCheckingAuth) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
