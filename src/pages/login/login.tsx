import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { login, selectIsAuthenticated } from '../../services/slices/authSlice';
import { useSelector } from '../../services/store';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuth) {
      const origin = location.state?.from?.pathname || '/profile';
      navigate(origin, { replace: true });
    }
  }, [isAuth, location, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(login({ email, password })).unwrap();
      const from =
        location.state?.from?.pathname || location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    }
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
