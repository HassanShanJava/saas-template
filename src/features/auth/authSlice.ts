import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit"
import axios from "axios";

// interface User{
// 	id:integer;
// 	name:string
// 	org_id:
// }
 
// const authSlice = createSlice({
// 	name: 'auth',
// 	initialState,
// 	reducers: {},
// })

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
// export default authSlice.reducer
