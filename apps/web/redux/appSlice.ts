import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    socket: null,    
    shapes: [],  
    roomId: "",
    token: "",
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
    },
    setToken: (state,action) =>{
      state.token = action.payload
    }
   
  },
});

export const { setSocket, addShapes,setroomId,setToken} = appSlice.actions;
export default appSlice.reducer;
