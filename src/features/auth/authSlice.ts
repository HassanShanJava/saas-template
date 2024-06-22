import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// 
const initialState = {
	loading: false,
	userInfo: {},
	userToken: null,
	error: null,
	success: false
}
// 
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
})
// 
// export const userLogin = createAsyncThunk(
// 	'auth/login',
// 	async ({ email , password }, { rejectWithValue }) => {
// 		try {
// 			const url: string; 
// 			const resp = await fetch(url, {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json'
// 				},
// 				body: JSON.stringify({})
// 			})
// 			const data = await resp.json();
// 
// 		} catch (err) {
// 			return rejectWithValue((err as Error).message);
// 		} 
// 	}
// )
// 
// 
export default authSlice.reducer
