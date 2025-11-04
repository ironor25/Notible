"use client"
import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../config";
import { Canvas } from "./Canvas";
import { useSession } from "next-auth/react";
import { store } from "../redux/store";
import { setroomId, setSocket } from "../redux/appSlice";
import { SwatchBookIcon } from "lucide-react";

export function RoomCanvas({roomId}:{roomId:string}
){
    const { data: session, status } =  useSession();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    // if (status == "loading" ){ return (<div>Loading Cnavas ....</div>) }
    store.dispatch(setroomId(roomId))
      useEffect(()=>{
       if (status !== "authenticated" || !session?.user?.token) return;
        const ws = new WebSocket(`${WS_URL}?token=${session?.user.token}`)
        console.log(session?.user.token)
        ws.onopen = () =>{
            setSocket(ws)
            ws.send(JSON.stringify({
              type:"join_room",
              roomId
            }))
        }
    },[ status])


   if(!socket){
    return <div>
      Connecting to server...
    </div>
  }

  return (
    <div >
  
      <Canvas socket={socket}/>
      </div>
    
  );
}