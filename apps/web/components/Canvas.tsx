import { useEffect, useRef, useState } from "react";
import { initDraw } from "../app/draw";



export function Canvas({roomId,socket}:{roomId:string; socket: WebSocket;}){
    const canvasRef = useRef<HTMLCanvasElement>(null)



    useEffect(()=>{
        if (canvasRef.current){
            initDraw(canvasRef.current,roomId,socket);
        }
    },[canvasRef]);


    return (
        <div> 
        <canvas
        ref={canvasRef}
        width={"1533"}
        height={"795"}

      />
        </div>
    )

}