import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import { ClientAPi } from "@/services/clientAPi";
import { Leads } from "@/services/leadsApi";
import { Credits } from "@/services/creditsApi";
const store = configureStore({
  reducer: {
    auth: authReducer,
    [ClientAPi.reducerPath]: ClientAPi.reducer,
    [Leads.reducerPath]: Leads.reducer,
    [Credits.reducerPath]: Credits.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      ClientAPi.middleware,
      Leads.middleware,
      Credits.middleware
    ),
});

export type AppStore= typeof store;
export type RootState=ReturnType<AppStore['getState']>;
export type AppDispatch=AppStore['dispatch'];

export default store;
