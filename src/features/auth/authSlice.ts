import { getUserResource, loginUser } from "@/services/authService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
interface User {
  id: number;
  first_name: string;
  email: string;
  org_id: number;
  role_id: number;
  org_name: string;
}

interface AuthState {
  userToken: string | null;
  userInfo: {
    user: User;
    sidepanel: Array<any>;
    accessLevels: Record<string, string>;
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
      localStorage.removeItem("sidepanel");
      localStorage.removeItem("accessLevels");
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
      state.userInfo = { user: payload.user, sidepanel: payload.sidepanel, accessLevels: payload.accessLevels };
      state.userToken = payload.token.access_token;
      state.error = null;
      const stringifiedData = JSON.stringify(payload.sidepanel);
      const encodedData = btoa(stringifiedData);
      console.log(payload.accessLevels, "accessLevels")
      localStorage.setItem("userInfo", JSON.stringify({ user: payload.user })); // Set userInfo in local storage
      localStorage.setItem("sidepanel", encodedData); // Set sidepanel in local storage
      localStorage.setItem("accessLevels", JSON.stringify(payload.accessLevels)); // Set sidepanel in local storage
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

      const { data: userRoles } = await getUserResource(data.user.role_id, data.token.access_token)
      console.log({ userRoles });
      const accessLevels = extractAccessCodes(userRoles)
      if (userRoles && accessLevels) {
        const stringifiedData = JSON.stringify(userRoles);
        const encodedData = btoa(stringifiedData);
        localStorage.setItem("sidepanel", encodedData);
        localStorage.setItem("accessLevels", JSON.stringify(accessLevels)); // Set sidepanel in local storage

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
      return { ...data, sidepanel: userRoles, accessLevels: accessLevels };
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

function extractAccessCodes(data: any) {
  let accessMap: Record<string, string> = {};

  function processItem(item: Record<string, any>) {
    const accessType: string = item.access_type;

    if (accessType) {
      accessMap[item.code] = accessType;
    }

    if (item.children && item.children.length > 0) {
      item.children.forEach(processItem);
    }
  }

  data.forEach(processItem);

  return accessMap;
}
