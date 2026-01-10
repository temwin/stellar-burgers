import { TIngredient } from '@utils-types';
import reducer, { fetchIngredients } from '../ingredientsSlice';

describe('ingredientsSlice', () => {
  const initialState = reducer(undefined, { type: '@@INIT' });

  describe('fetchIngredietns.pending', () => {
    it('должен установить loading в true при начале загрузки', () => {
      const newState = reducer(
        initialState,
        fetchIngredients.pending('requestId')
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.items).toEqual([]);
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен записать данные и установить loading в false при успешной загрузке', () => {
      const mockIngredients: TIngredient[] = [
        {
          _id: '1',
          name: 'Краторная булка',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'bun.png',
          image_large: 'bun-large.png',
          image_mobile: 'bun-mobile.png'
        },
        {
          _id: '2',
          name: 'Биокотлена',
          type: 'main',
          proteins: 50,
          fat: 20,
          carbohydrates: 30,
          calories: 300,
          price: 750,
          image: 'patty.png',
          image_large: 'patty-large.png',
          image_mobile: 'patty-mobile.png'
        }
      ];

      const loadingState = {
        ...initialState,
        loading: true
      };

      const newState = reducer(
        loadingState,
        fetchIngredients.fulfilled(mockIngredients, 'requestId')
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.items).toEqual(mockIngredients);
      expect(newState.items).toHaveLength(2);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен записать ошибку и установить loading в false при ошибке загрузки', () => {
        const loadingState = {
            ...initialState,
            loading: true
        };

        const error = new Error('Network Error');

        const newState = reducer(
            loadingState,
            fetchIngredients.rejected(error, 'requesrId')
        );

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe('Network Error');
        expect(newState.items).toEqual([]);
    });
  });
});
