import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
    counter_number?: number | null;
    code?: string | null
}

const initialState: CounterState = {
    counter_number: Number(localStorage.getItem("counter_number")) ?? null,
    code: localStorage.getItem("code") ?? null
};

const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        setCounter: (state, action: PayloadAction<number | null>) => {
            state.counter_number = action.payload;
            localStorage.setItem('counter_number', String(action.payload))
        },
        setCode: (state, action: PayloadAction<string | null>) => {
            state.code = action.payload;
            localStorage.setItem('code', action.payload as string)
        },
    },
});

export const { setCounter, setCode } = counterSlice.actions

export default counterSlice.reducer;
