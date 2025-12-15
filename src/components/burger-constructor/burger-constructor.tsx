import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useSelector, useDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  createOrder,
  clearConstructor,
  selectBun,
  selectConstructorLoading,
  selectConstructorIngredients,
  selectConstructorOrder
} from '../../services/slices/burgerConstructorSlice';
import { selectUser } from '../../services/slices/authSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useSelector(selectBun);
  const ingredients = useSelector(selectConstructorIngredients);

  const order = useSelector(selectConstructorOrder);
  const loading = useSelector(selectConstructorLoading);
  const user = useSelector(selectUser);

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const orderRequest = loading;
  const orderModalData = order;

  const onOrderClick = async () => {
    if (
      !constructorItems.bun ||
      constructorItems.ingredients.length === 0 ||
      orderRequest
    ) {
      return;
    }

    if (!user) {
      navigate('/login', {
        state: { from: location.pathname }
      });
      return;
    }

    const ingredientIds: string[] = [];

    if (constructorItems.bun) {
      ingredientIds.push(constructorItems.bun._id);
    }

    constructorItems.ingredients.forEach((ingredient) => {
      ingredientIds.push(ingredient._id);
    });

    if (constructorItems.bun) {
      ingredientIds.push(constructorItems.bun._id);
    }

    try {
      dispatch(createOrder(ingredientIds)).unwrap();
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
    }
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
