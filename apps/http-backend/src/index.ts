import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateroomSchema, CreateUserSchema, SigninSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
const app = express()
app.use(express.json())
app.post("/api/v1/signup",async (req,res)=>{
    const parsedData = CreateUserSchema.safeParse(req.body)
    if (!parsedData.success){
        return res.json({
            message : "Incorrect inputs"
        })
    }

    try{
    const user = await prismaClient.user.create({
        data:{
            email : parsedData.data?.username,
            password : parsedData.data.password,
            name : parsedData.data.name,
        }
        
    })
    res.json({
        uid: user.id
    })}
    catch{
        res.status(411).json({
            message :"user already exist."
        })
    }

})


app.post("/api/v1/signin",async (req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body)
    if (!parsedData.success){
        res.json({
            message : "Incorrect inputs"
        })
        return;
    }

    //toddo xompare hash password
    const user = await prismaClient.user.findFirst({
        where:{
            "email":parsedData.data.username,
            "password": parsedData.data.password
        }
    })

    if (!user){
        res.status(403).json({
            message : "Not Authorized."
        })
        return;
    }
    const token =  jwt.sign({
        userId : user?.id
     },JWT_SECRET);

     res.json({
        token
     })
    
})


app.post("/room", middleware,async (req,res)=>{
    const parsedData = CreateroomSchema.safeParse(req.body)
    if (!parsedData.success){
        res.json({
            message : "incorrect inputs"
        })
        return
    }
    //@ts-ignore
    const userId = req.userId
    //db call
    try{
        const room = await prismaClient.room.create({
        data:{
            slug:parsedData.data.name,
            adminId:userId
        }
    })
    res.json({
        roomId: room.id
    })}
    catch(e){
        res.status(411).json({
            message:"room already exist."
        })
    }
})

app.get("/chats/:roomId",async (req,res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where:{
            roomId: roomId
        },
        orderBy :{
            "id": "desc"
        } ,
        take  : 50
    })
    res.json({
        messages
    })
})

app.listen(3001, ()=>{
    console.log("server started.")
})