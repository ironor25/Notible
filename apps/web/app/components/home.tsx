"use client"


import { useState } from "react"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios"
import { BACKEND_URL } from "../../config";

export default function Home(){
  const {data: session , status} = useSession()  
  const token = session?.user
  const router = useRouter()
  const [roomId, setroomId] = useState("");

 
  async function handleclick(type: string){
        console.log(roomId)
        if (type== "join_room"){ 

             const room = await axios.get(`${BACKEND_URL}/room/${roomId}`)
             console.log(room)
             if (room){
               router.push(`/canvas/${room.data.id}`)
             }
         
        }
        else{
          console.log("x")
        }
      }
  return (
    <div className="flex w-screen h-screen flex-col justify-center items-center bg-gray-800">
    <input type="text" 
    className="w-2xl border-2 m-10 p-5 rounded-2xl bg-white text-black"
    value={roomId}
    onChange={(e)=>{
      setroomId(e.target.value)
    }}
    placeholder="Room id"></input>
    <button onClick={()=> {
     handleclick("join_room")
    }}
    className="bg-amber-50 p-3 mb-4 rounded-2xl cursor-pointer hover:bg-amber-200"
    >Join room</button>
    <button onClick={()=> {
      handleclick("create-room")
    }}
    className="bg-amber-50 p-3 rounded-2xl cursor-pointer hover:bg-amber-200"
    >Create Room</button>
    
   </div>
  )
  

}