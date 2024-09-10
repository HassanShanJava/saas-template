import { getUserResource, loginUser } from "@/services/authService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Console } from "console";

interface User {
  id: number;
  first_name: string;
  email: string;
  org_id: number;
  org_name: string;
}

interface AuthState {
  userToken: string | null;
  userInfo: {
    user: User;
  } | null;
  error: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  lastRefetch: number | null;
}

const userToken = localStorage.getItem("userToken");
const userInfo = localStorage.getItem("userInfo");

const initialState: AuthState = {
  userToken,
  userInfo: userInfo ? JSON.parse(userInfo) : null,
  error: null,
  loading: false,
  isLoggedIn: userToken ? true : false,
  lastRefetch: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    tokenReceived: (state, action) => {
      state.userToken = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      state.userToken = null;
      state.userInfo = null;
      state.error = null;
      state.loading = false;
      state.isLoggedIn = false;
      state.lastRefetch = null;
    },
    updateLastRefetch: (state) => {
      state.lastRefetch = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.userInfo = { user: payload.user };
      state.userToken = payload.token.access_token;
      state.error = null;
      localStorage.setItem("userInfo", JSON.stringify({ user: payload.user })); // Set userInfo in local storage
      localStorage.setItem("userToken", payload.token.access_token); // Set userToken in local storage
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
  },
});

interface loginParams {
  email: string;
  password: string;
  rememberme: boolean;
}
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, rememberme }: loginParams, { rejectWithValue }) => {
    try {
      const {
        data,
      }: { data: { token: { access_token: string }; user?: any } } =
        await loginUser(email, password);

      console.log({ data })
      if (data.user.role_id) {
        const { data: userRoles } = await getUserResource(data.user.role_id, data.token.access_token    )
        console.log({ userRoles });
      }
      localStorage.setItem("userToken", data.token?.access_token);
      if (rememberme) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        if (localStorage.getItem("email") != null)
          localStorage.removeItem("email");
        if (localStorage.getItem("password") != null)
          localStorage.removeItem("password");
      }
      return data;
    } catch (e: any) {
      console.log(e);
      localStorage.removeItem("password");
      localStorage.removeItem("email");

      if (e.response?.data?.detail) {
        return rejectWithValue(e.response?.data?.detail);
      }
      return rejectWithValue(e.message);
    }
  }
);

export const { logout, tokenReceived, updateLastRefetch } = authSlice.actions;
export default authSlice.reducer;
