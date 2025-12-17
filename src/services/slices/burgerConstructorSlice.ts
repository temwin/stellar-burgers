import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { RootState } from '../store';

interface BurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  order: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
  order: null,
  loading: false,
  error: null
};

// Асинхронный экшен для создания заказа
export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },

    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [moveIngredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, moveIngredient);
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      });
  }
});

export const addIngredientWithId = (ingredient: TIngredient) => {
  const ingredientWithId: TConstructorIngredient = {
    ...ingredient,
    id: nanoid()
  };

  return burgerConstructorSlice.actions.addIngredient(ingredientWithId);
};

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const selectBun = (state: RootState) => state.burgerConstructor.bun;

export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectConstructorOrder = (state: RootState) =>
  state.burgerConstructor.order;

export const selectConstructorError = (state: RootState) =>
  state.burgerConstructor.error;

export const selectConstructorLoading = (state: RootState) =>
  state.burgerConstructor.loading;

export default burgerConstructorSlice.reducer;
