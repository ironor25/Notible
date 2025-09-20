import axios  from "axios"
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug:string) {
    
    const response  = await axios.get(`${process.env.BACKEND_URL}/room/${slug}`)
    
    return response.data.room.id
}


export default  async function Room({params}:{
    params : Promise<{
        slug :string
    }>
}){
    const slug = (await params).slug
    console.log(slug)
    const roomId = await getRoomId(slug)
  
    if (roomId){
        return <ChatRoom id={roomId}></ChatRoom>
    }

    else{
        return 0
    }
}