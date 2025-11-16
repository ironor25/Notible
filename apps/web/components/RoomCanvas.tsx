"use client"
import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../config";
import { Canvas } from "./Canvas";
import { useSession } from "next-auth/react";
import { store } from "../redux/store";
import { setroomId, setSocket, setToken } from "../redux/appSlice";
import { useRouter } from "next/navigation";


export function RoomCanvas({roomId}:{roomId:string}
){
    const { data: session, status } =  useSession();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const router = useRouter()
    // if (status == "loading" ){ return (<div>Loading Cnavas ....</div>) }
    store.dispatch(setroomId(roomId))
    
   
      useEffect(()=>{
        if (status === "loading") return;

   
        if (status !== "authenticated" || !session?.user?.token) {
          router.replace("/signup");
          return;
        }
        store.dispatch(setToken(session?.user.token))
        const wss = new WebSocket(`${WS_URL}?token=${session?.user.token}`)
        
        wss.onopen = () =>{
            setSocket(wss)
            wss.send(JSON.stringify({
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