import { NextResponse } from "next/server";
import { prismaClient } from "@repo/db/client";
import { use } from "react";


export async function POST(req: Request) {

    const {name, email , password} = await req.json()
    if (!email || !password||!name){
       return  NextResponse.json(
      { message: "provide each credential" },
      { status: 500 }
    );
    }
   
      const user_exist = await prismaClient.user.findFirst({
        where: {
          "email":email
        }
       })
      
       if (user_exist){
        return (NextResponse.json({error:"user already exist"},{status:200}))
       }

      const user = await prismaClient.user.create({
      data:{
        email,
        password,
        name
      },
    })
    
    
    
    return NextResponse.json({user});
  
}