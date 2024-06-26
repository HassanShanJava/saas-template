import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import {thunk} from "redux-thunk";
const store = configureStore({
	reducer: {
		auth: authReducer,
	},
	middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk),
})

export type AppStore= typeof store;
export type RootState=ReturnType<AppStore['getState']>;
export type AppDispatch=AppStore['dispatch'];

export default store;
