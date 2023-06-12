import { createSlice } from "@reduxjs/toolkit";
import { LocalStorageKeys } from "../../utils/shared";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../utils/enum";

const initialUserValues = {
    email: "",
    firstName: "",
    id: 0,
    lastName: "",
    password: "",
    role: "",
    roleId: 0,
};

const initialState = {
    user: initialUserValues,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(action.payload))
        },
        signOut: (state) => {
            state.user = initialUserValues
            localStorage.removeItem(LocalStorageKeys.USER, JSON.stringify(initialUserValues))
        }
    },
});

// console.log(authSlice.actions)

export const { setUser, signOut } = authSlice.actions;

export default authSlice.reducer;