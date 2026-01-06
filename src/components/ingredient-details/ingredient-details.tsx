import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';
import styles from '../app/app.module.css';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);

  const isModal = !!location.state?.background;

  if (loading && ingredients.length === 0) {
    return <Preloader />;
  }

  const ingredientData = ingredients.find(
    (ingredients) => ingredients._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  if (!isModal) {
    return (
      <div className={styles.detailPageWrap}>
        <IngredientDetailsUI ingredientData={ingredientData} />
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
