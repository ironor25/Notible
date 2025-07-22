import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema} from "@repo/common/types"
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


app.post("/api/v1/signin",(req,res)=>{
    const uid = 1;
    const token =  jwt.sign({
        uid
     },JWT_SECRET);

     res.json({
        token
     })
    
})


app.post("/room", middleware,(req,res)=>{
    //db call
    res.json({
        roomId: 123
    })
})

app.listen(3001, ()=>{
    console.log("server started.")
})