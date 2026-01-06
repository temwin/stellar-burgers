import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  selectModalOrder,
  selectOrderLoading
} from '../../services/slices/orderSlice';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import styles from '../app/app.module.css';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const orderData = useSelector(selectModalOrder);
  const loading = useSelector(selectOrderLoading);
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);
  const location = useLocation();

  const isModal = !!location.state?.background;

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(number));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || ingredientsLoading) {
    return <Preloader />;
  }

  if (!orderData) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  if (!isModal) {
    return (
      <div className={styles.detailPageWrap}>
        <OrderInfoUI orderInfo={orderInfo} />
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
