import axios from "axios"
import { BACKEND_URL } from "../config"
import { ChatRoomClient } from "./ChatRoomClient";
import { measureMemory } from "vm";

async function getchats( roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.messages
}


export async function ChatRoom({id}:{
    id:string
}){
    const messages = await getchats(id);
    console.log(messages)

    return <ChatRoomClient id={id} messages={messages}></ChatRoomClient>
}