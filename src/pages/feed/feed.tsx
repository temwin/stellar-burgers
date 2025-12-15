import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchAllOrders,
  selectOrderLoading,
  selectOrders
} from '../../services/slices/orderSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchAllOrders());
  };

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
