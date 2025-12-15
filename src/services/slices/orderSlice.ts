import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { AppDispatch, RootState } from '../store';
import { act } from 'react-dom/test-utils';

interface OrderState {
  orders: TOrder[];
  modalOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
}

const initialState: OrderState = {
  orders: [],
  modalOrder: null,
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0
};

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (orderNumber: string) => {
    try {
      const response = await getOrderByNumberApi(Number(orderNumber));
      const order = response.orders[0];
      return order;
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка загрузки заказа');
    }
  }
);

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>('order/fetchUserOrders', async (_, thunkAPI) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка получения истории заказов'
    );
  }
});

export const fetchAllOrders = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>('order/fetchAllOrders', async (_, thunkAPI) => {
  try {
    const response = await getFeedsApi();
    return {
      orders: response.orders || [],
      total: response.total || 0,
      totalToday: response.totalToday || 0
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка получения ленты заказов'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setModalOrder: (state, action: PayloadAction<TOrder | null>) => {
      state.modalOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateOrdersFromWebSocket: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isLoading = false;
    },

    updateUserOrdersFromWebSocket: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
      state.isLoading = false;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modalOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка загрузки истории заказов';
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка загрузки ленты заказов';
      });
  }
});

export const {
  setModalOrder,
  clearError,
  updateOrdersFromWebSocket,
  updateUserOrdersFromWebSocket
} = orderSlice.actions;

export default orderSlice.reducer;

export const selectOrders = (state: RootState) => state.order.orders;
export const selectModalOrder = (state: RootState) => state.order.modalOrder;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectTotalOrders = (state: RootState) => state.order.total;
export const selectTotalTodayOrders = (state: RootState) =>
  state.order.totalToday;
