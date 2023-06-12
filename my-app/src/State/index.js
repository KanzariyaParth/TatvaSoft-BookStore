import { configureStore } from '@reduxjs/toolkit';

import cartSliceReducer from './Slice/cartSlice';
import authSliceReducer from './Slice/authSlice';

const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    auth: authSliceReducer,
  },
});

export default store;