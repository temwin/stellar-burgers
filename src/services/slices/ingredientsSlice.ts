import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients', // уникальное имя
  initialState, // Начальное состояние
  reducers: {
    // Синхронные действия
  },
  extraReducers: (builder) => {
    // обработка асинх. действий
    builder
      // 1 - старт запроса
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // 2 - когда запрос успешно завершился
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      // 3 - когда произошла ошибка
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ингридиентов';
      });
  }
});

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export default ingredientsSlice.reducer;
