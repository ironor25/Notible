import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    socket: null,    
    shapes: [],  
    roomId: ""
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload; 
    },
    addShapes: (state, action) => {
        //@ts-ignore
      state.shapes.push(action.payload); 
    },
    setroomId:(state,action)=>{
      state.roomId = action.payload
    }
   
  },
});

export const { setSocket, addShapes,setroomId} = appSlice.actions;
export default appSlice.reducer;
