import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema} from "@repo/common/types"
const app = express()

app.post("/api/v1/signup",(req,res)=>{
    const data = CreateUserSchema.safeParse(req.body)
    if (!data.success){
        return res.json({
            message : "Incorrect inputs"
        })
    }

    res.json({
        uid: "123"
    })

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

app.listen(3000, ()=>{
    console.log("server started.")
})