import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, updateUser } from '../../services/slices/authSlice';
import {
  selectUser,
  selectAuthLoading,
  selectAuthError
} from '../../services/slices/authSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name ?? '',
        email: user.email ?? '',
        password: ''
      });
      setIsPasswordChanged(false);
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    isPasswordChanged;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const updateData: any = {};

      if (formValue.name !== (user?.name ?? '')) {
        updateData.name = formValue.name;
      }
      if (formValue.email !== (user?.email ?? '')) {
        updateData.email = formValue.email;
      }
      if (Object.keys(updateData).length > 0) {
        await dispatch(updateUser(updateData)).unwrap();
        setFormValue((prev) => ({ ...prev, password: '' }));
        setIsPasswordChanged(false);
      }
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name ?? '',
        email: user.email ?? '',
        password: ''
      });
      setIsPasswordChanged(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'password') {
      setIsPasswordChanged(true);
    }
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error ?? undefined}
    />
  );
};
