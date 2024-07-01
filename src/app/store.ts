import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import {thunk} from "redux-thunk";
import { ClientAPi } from "@/services/clientAPi";
const store = configureStore({
  reducer: {
    auth: authReducer,
    [ClientAPi.reducerPath]: ClientAPi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      ClientAPi.middleware
    ),
});

export type AppStore= typeof store;
export type RootState=ReturnType<AppStore['getState']>;
export type AppDispatch=AppStore['dispatch'];

export default store;
