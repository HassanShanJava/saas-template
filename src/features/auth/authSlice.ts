import { ResourceTypes } from "@/app/types/roles";
import { getUserResource, loginUser } from "@/services/authService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
interface User {
  token_type: string;
  id: string;
  first_name: string;
  last_name: string;
  org_name: string;
  email: string;
  org_id: number;
  role_id?: number;
}


interface AuthState {
  userToken: string | null;
  userInfo: User | null;
  accessLevels: Record<string, string>;
  sidePanel: string;
  error: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  lastRefetch: number | null;
  isEmailVerify: boolean;
  skipRequests: boolean;
}

// Extract values from localStorage
const userToken = localStorage.getItem("userToken");
const userInfo = localStorage.getItem("userInfo");
const accessLevels = localStorage.getItem("accessLevels");
const sidePanel = localStorage.getItem("sidePanel");

const initialState: AuthState = {
  userToken,
  userInfo: userInfo ? JSON.parse(userInfo) : null,
  accessLevels: accessLevels ? JSON.parse(accessLevels) : {},
  sidePanel: sidePanel ?? "",
  error: null,
  loading: false,
  isLoggedIn: Boolean(userToken),
  lastRefetch: null,
  isEmailVerify: false,
  skipRequests: false, // Add this line
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
      localStorage.removeItem("sidePanel");
      localStorage.removeItem("accessLevels");
      localStorage.removeItem("userType");
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
      const { sidepanel, accessLevels, ...user } = payload.response;
        state.loading = false;
        state.error = null;
        state.isLoggedIn = true;
        state.userInfo = user;
        state.userToken = user.access_token; // Save token
        localStorage.setItem("userToken", payload.response.access_token);
        localStorage.setItem("userInfo", JSON.stringify(payload.response));
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

      // if (userResource && accessLevels) {
      //   const sortByIndex = (a: ResourceTypes, b: ResourceTypes) =>
      //     a.index - b.index;

      //   // Recursive sorting and filtering function
      //   const sortAndFilterResources = (resources: ResourceTypes[]): ResourceTypes[] => {
      //     return resources
      //       .filter((resource) => {
      //         // Step 1: Filter out resources where the code starts with "hide_"
      //         if (resource.code.startsWith("hide_")) {
      //           return false;
      //         }
        
      //         // Step 2: Recursively filter children if they exist
      //         if (resource.children && resource.children.length > 0) {
      //           const filteredChildren = sortAndFilterResources(resource.children);
        
      //           // Assign the filtered children to the parent
      //           resource.children = filteredChildren;
        
      //           // If all children are filtered out, evaluate the parent's `access_type`
      //           if (filteredChildren.length === 0 && resource.access_type === "no_access") {
      //             return false;
      //           }
        
      //           // If all filtered children have `access_type` as "no_access", remove the parent
      //           if (
      //             filteredChildren.every((child) => child.access_type === "no_access") &&
      //             resource.access_type === "no_access"
      //           ) {
      //             return false;
      //           }
      //         } else {
      //           // Step 3: If no children and `access_type` is "no_access", remove the resource
      //           if (resource.access_type === "no_access") {
      //             return false;
      //           }
      //         }
        
      //         return true; // Keep the resource if it passes all checks
      //       })
      //       .sort(sortByIndex); // Sort by index
      //   };
        
      //   // 1. Sort and filter the side panel resources
      //   const filteredSortedResources = sortAndFilterResources(userResource);
      //   console.log({ userResource, filteredSortedResources });


      //   // 2. set sidepanel in localstorage as base64 encoded
      //   const stringifiedData = JSON.stringify(filteredSortedResources);
      //   const encodedData = btoa(stringifiedData);
      //   localStorage.setItem("sidepanel", encodedData);


      //   // 3. set accessLevels in local storage
      //   localStorage.setItem("accessLevels", JSON.stringify(accessLevels));

      //   // 4. set pospanel and sidepanel and accessLevels in redux state
      //   payload.sidepanel = encodedData;
      //   payload.accessLevels = accessLevels;
      // }
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
