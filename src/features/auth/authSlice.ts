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
	userInfo: any;
	error: string | null;
	loading: boolean;
}

const userToken = localStorage.getItem('userToken');

const initialState: AuthState = {
	userToken,
	userInfo: null,
	error: null,
	loading: false
}
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(login.pending, state => {
			state.loading = true
			state.error = null
		})
		builder.addCase(login.fulfilled, (state, {payload}) => {
			state.loading = false
			state.userInfo = payload
			state.error = null
		})
		builder.addCase(login.rejected, (state, {payload}) => {
			state.loading = false
			state.error = payload as string
		})
	}
})


interface loginParams {
	email: string;
	password: string;
	rememberme: string;
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


export default authSlice.reducer
