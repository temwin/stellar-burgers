import { useSelector, useDispatch } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

import styles from './constructor-page.module.css';

import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  const items = useSelector(selectIngredients);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length]);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
