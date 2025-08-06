import axios from "axios"
import { BACKEND_URL } from "../config"
import { ChatRoomClient } from "./ChatRoomClient";

async function getchats( roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.messages
}


export async function ChatRoom({id}:{
    id:string
}){
    const messages = await getchats(id);

    return <ChatRoomClient id={id} messages={messages}></ChatRoomClient>
}