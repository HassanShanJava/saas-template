import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import {thunk} from "redux-thunk";
const store = configureStore({
	reducer: {
		auth: authReducer,
	},
	middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk),
})

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;

export default store;
