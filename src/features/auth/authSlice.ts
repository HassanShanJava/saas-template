import { loginUser } from "@/services/authService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

interface User {
	id: number;
	name: string;
	org_id: number;
}

interface AuthState {
	userToken: string | null;
	userInfo: User | null;
	error: string | null;
	loading: boolean;
}

const userToken = localStorage.getItem('userToken');
const userInfo = localStorage.getItem("userInfo");

const initialState: AuthState = {
  userToken,
  userInfo: userInfo ? JSON.parse(userInfo) : null,
  error: null,
  loading: false,
};
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(login.pending, state => {
			state.loading = true;
			state.error = null;
		})
		builder.addCase(login.fulfilled, (state, {payload}) => {
      state.loading = false;
      state.userInfo = payload;
      state.error = null;
      localStorage.setItem("userInfo", JSON.stringify(payload)); // Set userInfo in local storage
    })
		builder.addCase(login.rejected, (state, {payload}) => {
			state.loading = false;
			state.error = payload as string;
		})
		builder.addCase(logout.fulfilled,(state)=>{
			state.userToken = null;
      state.userInfo = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
		})
	}
})


interface loginParams {
	email: string;
	password: string;
	rememberme: boolean;
}
export const login = createAsyncThunk(
	'auth/login',
	async ({email, password, rememberme}: loginParams, {rejectWithValue}) => {
		try {
			const {data}: {data: {token: {access_token: string}, user?: any}} = await loginUser(email, password);
			localStorage.setItem('userToken', data.token?.access_token)
			if (rememberme) {
				localStorage.setItem('email', email)
				localStorage.setItem('password', password)
			} else {
				if(localStorage.getItem('email') != null)
					localStorage.removeItem('email')
				if(localStorage.getItem('password') != null)
					localStorage.removeItem('password')
			}
			return data.user;
		} catch(e: any) {
			console.log(e)
			if(e.response?.data?.detail) {
				return rejectWithValue(e.response?.data?.detail)
			}
			return rejectWithValue(e.message)
		}
	}

)


export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    // Simulate logout API call
    // await fetch("/api/logout", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    //   },
    // });

    // Clear local storage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
});
export default authSlice.reducer
