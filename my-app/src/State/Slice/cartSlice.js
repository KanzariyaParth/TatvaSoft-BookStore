import { createSlice } from "@reduxjs/toolkit";
import cartService from "../../service/cart.service";

const initialCartState = {
  cartData: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload;
    },
    updateCart: (state, action) => {
      state.cartData = [...state.cartData, action.payload];
      console.log("Update Cart ==> ", state.cartData)
    },
    removeFromCart: (state, action) => {
        state.cartData = state.cartData.filter(
          (item) => item.id !== action.payload
        );
    },
    emptyCart: (state, action) => {
      state.cartData = [];
    },
  },
});

console.log(cartSlice.actions);

export const { setCartData, updateCart, removeFromCart } = cartSlice.actions;

export const fetchCartData = (userId) => async (dispatch) => {
  try {
    const res = await cartService.getList(userId);
    dispatch(setCartData(res));
  } catch (error) {}
};

export default cartSlice.reducer;

// export { setCartData, updateCart, removeFromCart };
