import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import {thunk} from "redux-thunk";
import {api} from "@/services/clientAPi";
const store = configureStore({
	reducer: {
		auth: authReducer,
		[api.reducerPath]:api.reducer,
	},
	middleware:(getDefaultMiddleware)=>getDefaultMiddleware(
		{serializableCheck:false}
	).concat(
		api.middleware
	),
})

export type AppStore= typeof store;
export type RootState=ReturnType<AppStore['getState']>;
export type AppDispatch=AppStore['dispatch'];

export default store;
