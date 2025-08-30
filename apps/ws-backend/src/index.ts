import  {WebSocketServer , WebSocket} from "ws";
import jwt, { decode, JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({port:8080})

interface User{
    userId : string,
    rooms : string[],
    ws : WebSocket
}

const users : User[] = [];

function checkUser(token : string): string | null {
    try{
        const decoded = jwt.verify(token,JWT_SECRET)
        console.log(decoded)
        if (typeof decoded == "string"){
            return null;
        }
        if (!decoded || !decoded.userId){
            wss.close();
            return null;
        }
        return decoded.userId;
    }
    catch(e){
        console.log(e)
        return null;;
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
    console.log(token)
    const  userId = checkUser(token)

    if (!userId){

        ws.close();
        return ;
    }

    users.push({userId,rooms:[],ws})


    ws.on("message",async function message(data){
        const parseData = JSON.parse(data as unknown as string);
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
                data:{
                    roomId,
                    message,
                    userId
                }
            })

            //you can do this 
            //push it to a que
            //then push it to db using pipeline.
            console.log(typeof roomId.toString(), typeof users[0]?.rooms[0])
            console.log( users[0]?.rooms.includes(roomId.toString()))
            console.log(users[0]?.rooms[0] === roomId.toString())
            users.forEach(
                user => {
                    if (user.rooms.includes(roomId.toString())){
                        console.log("inside")
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