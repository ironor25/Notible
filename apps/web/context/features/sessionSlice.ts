import { createSlice} from "@reduxjs/toolkit";

const initialState= {
    token : null
}

const sessionslice = createSlice({
    name:"session",
    initialState,
    reducers:{
        setToken: (state, action) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = null
        }
    }
})

export const {setToken, clearToken} =  sessionslice.actions;
export default sessionslice.reducer;