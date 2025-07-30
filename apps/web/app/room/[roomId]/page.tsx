import axios  from "axios"
import { BACKEND_URL } from "../../../config"

async function getRoomId(slug:string) {
    const response  = await axios.get(`${BACKEND_URL}/roomid/${slug}`)
    return response.data.id;
}


export default  async function ChatRoom({params}:{
    params :{
        slug :string
    }
}){
    
    const slug = (await params).slug
    const roomId = await getRoomId(slug)

    console.log(slug)
}