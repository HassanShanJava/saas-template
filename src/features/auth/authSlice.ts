import { ResourceTypes } from "@/app/types/roles";
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
      localStorage.setItem("userInfo", JSON.stringify({ user: payload.user }));
      localStorage.setItem("sidepanel", payload.sidepanel);
      localStorage.setItem("accessLevels", JSON.stringify(payload.accessLevels));
      localStorage.setItem("userToken", payload.token.access_token);
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
  },
});

interface LoginParams {
  email: string;
  password: string;
  rememberme: boolean;
  website_url: string;

}
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, rememberme, website_url }: LoginParams, { rejectWithValue }) => {
    try {

      const {
        data,
      }: { data: { token: { access_token: string }; user?: any } } =
        await loginUser(email, password, website_url);

      const { data: userResource } = await getUserResource(data.user.role_id, data.token.access_token)
      const payload: Record<string, any> = { ...data }
      const accessLevels = extractAccessCodes(userResource)

      if (userResource && accessLevels) {
        const sortByIndex = (a: ResourceTypes, b: ResourceTypes) =>
          a.index - b.index;

        // Recursive sorting function for children
        const sortResources = (resources: ResourceTypes[]): ResourceTypes[] =>
          resources
            .map((resource) => ({
              ...resource,
              children: resource.children
                ? sortResources([...resource.children].sort(sortByIndex))
                : undefined, // recursively sort children if present
            }))
            .sort(sortByIndex); // sort the main array by index

        // 1. sort the sidepanel based on the index field
        const sortUserResource = sortResources(userResource)

        // 2. filter any resources that have no_access
        const filterUserResource = sortUserResource.filter((sidepanel: any) => {
          // If the parent has no children, handle based on the parent's access_type
          if (!sidepanel.children || sidepanel.children.length === 0) {
            return sidepanel.access_type !== "no_access";
          }

          // If the parent has children, filter out the children with access_type == "no_access"
          const filteredChildren = sidepanel.children.filter((child: any) => child.access_type !== "no_access");

          // If after filtering, no children are left, we filter out the parent as well
          if (filteredChildren.length === 0) {
            return false; // Filter out the parent if all children have "no_access"
          }

          // Otherwise, keep the parent and assign the filtered children
          sidepanel.children = filteredChildren;
          return true;
        })

        // 3. set sidepanel in localstorage as base64 encoded 
        const stringifiedData = JSON.stringify(filterUserResource);
        const encodedData = btoa(stringifiedData);
        localStorage.setItem("sidepanel", encodedData);

        // 4. set accessLevels in local storage
        localStorage.setItem("accessLevels", JSON.stringify(accessLevels));

        // 5. set pospanel and sidepanel in redux state
        payload.sidepanel = encodedData;
        payload.accessLevels = accessLevels;
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
      return payload;
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
