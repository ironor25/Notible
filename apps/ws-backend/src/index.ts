import  {WebSocketServer , WebSocket} from "ws";
import jwt, { decode, JwtPayload } from "jsonwebtoken"
// import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import dotenv from "dotenv"

interface User{
    userId : string,
    rooms : string[],
    ws : WebSocket
}

dotenv.config()

const wss = new WebSocketServer({ host: "127.0.0.1",port:8080})
const JWT_SECRET = process.env.JWT_SECRET

const users : User[] = [];

function checkUser(token : string): string | null {
    // ensure JWT_SECRET is present and typed as a string so jwt.verify's signature is satisfied
    if (typeof JWT_SECRET !== "string" || JWT_SECRET.length === 0) {
        console.error("JWT_SECRET is not configured");
        return null;
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET)
        if (typeof decoded == "string"){
            return null;
        }
        // decoded is JwtPayload here
        const payload = decoded as JwtPayload;
        if (!payload || !payload.userId){
            wss.close();
            return null;
        }
        return payload.userId as string;
    }
    catch(e){
   
        return null;
    }

}

wss.on("connection",async function connection(ws,request) {

    //this below code is to verify jwt token coming from user.
    const url = request.url 
    if (!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";

    const  userId = checkUser(token)
    console.log(userId)
    if (!userId){

        ws.close();
        return ;
    }

    users.push({userId,rooms:[],ws})


    ws.on("message",async function message(data){
        let parseData : any;
        if (typeof data !== "string"){
            parseData = JSON.parse(data.toString())
        }
        else{
            parseData= JSON.parse(data)
        }
        
        if (parseData.type === "join_room"){
            const user = users.find(x => x.ws === ws)
            const user_data = await prismaClient.room.findFirst({
                where:{
                    "id":Number(parseData.roomId)
                }
            })
            if (user_data == null){
                ws.send("room does not exist");
            }
            else{
                 user?.rooms.push((parseData.roomId).toString())
                 ws.send("Room Joined successfully")
            }
            //one should check first that room exist or not , whom he wants to join
            
           
        }

        if (parseData.type == "leave_room"){
            const user = users.find(x => x.ws === ws)
            if(!user){
                return ;
            }
            user.rooms = user?.rooms.filter(x => x === parseData.room);
             
        }

        if (parseData.type === "chat"){
            const roomId = Number(parseData.roomId);
            const message = parseData.message
            // this is dumb approach
            await prismaClient.chat.create({
                data: {
                    roomId,
                    message,
                    userId
                }
            })

            //you can do this 
            //push it to a que
            //then push it to db using pipeline.
      
            users.forEach(
                user => {
                    if (user.rooms.includes(roomId.toString())){
            
                        user.ws.send(JSON.stringify({
                            type:"chat",
                            message : message,
                            roomId 
                        }))
                    }
                }
            )
        }
    })
})