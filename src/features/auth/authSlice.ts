import { loginUser } from "@/services/authService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

interface User {
	id: number;
	name: string;
	org_id: number;
}

const userToken = localStorage.getItem('userToken');

const initialState = {
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
			state.loading = true
			state.userInfo = payload
			state.error = null
		})
		builder.addCase(login.rejected, (state, {payload}) => {
			state.loading = false
			state.error = payload
		})
	}
})


export const login = createAsyncThunk(
	'auth/login',
	async ({email, password, rememberme}, {rejectWithValue}) => {
		try {
			const {data} = await loginUser(email, password);
			localStorage.setItem('userToken', data.token?.access_token)
			if (rememberme == 'on') {
				localStorage.setItem('email', email)
				localStorage.setItem('password', password)
			} else {
				if(localStorage.getItem('email') != null)
					localStorage.removeItem('email')
				if(localStorage.getItem('password') != null)
					localStorage.removeItem('password')
			}
			return data.user;
		} catch(e) {
			console.log(e)
			if(e.response?.data?.detail) {
				return rejectWithValue(e.response?.data?.detail)
			}
			return rejectWithValue(e.message)
		}
	}

)


export default authSlice.reducer
