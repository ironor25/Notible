"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { cookies } from "next/headers";

export function ChatRoomClient({
    messages,
    id
}:{
    messages: {message:string}[];
    id : string
}){
    const [chats,setChats] = useState(messages)
    const {socket , loading} = useSocket();
    const [currentMessage,setcurrentMessage] = useState("")
    useEffect(()=>{
        if (socket && !loading){
            socket.send(JSON.stringify({
                type:"join_room",
                roomId:id
            }))
            socket.onmessage=(event) =>{
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat"){
                    setChats(c => [...c,{message:parsedData.message}])
                }
            }
        }
    },[socket,loading,id])

    return (
        <div>
            {messages.map(m => <div>v{m.message}</div>)}
        <input type="text" value={currentMessage} onChange={e => {
            setcurrentMessage(e.target.value)
        }}>
        </input>
        <button
        onClick={ ()=>{
            socket?.send(JSON.stringify({
                type:"chat",
                roomId: id,
                message : currentMessage
            }))
            setcurrentMessage("");
        }}>Send msg</button>
        </div>
    )

}