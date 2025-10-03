import { useEffect, useRef, useState } from "react";
import { initDraw } from "../app/draw";
import { IconButton } from "./Icons";
import {Circle, Pencil, RectangleHorizontalIcon, Slash} from "lucide-react"

type Shape =  "circle"| "rect"| "pencil" | "line"

export function Canvas({roomId,socket}:{roomId:string; socket: WebSocket;}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setSelectedTool] =  useState<Shape>("rect")

    useEffect(()=>{
        if (canvasRef.current){
            initDraw(canvasRef.current,roomId,socket);
        }
    },[canvasRef]);

    return (
         <div style={{"overflow":"hidden"}}>
            <canvas ref = {canvasRef} width={window.innerWidth} height={window.innerHeight} />
            <TopIconBar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
         </div>
    )
}

function TopIconBar({selectedTool,setSelectedTool}:
    {
        selectedTool: Shape,
        setSelectedTool: (s: Shape) => void
    }
){
    return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex gap-2 overflow-hidden" >
            <IconButton icon={<Pencil/>} onClick={() => {setSelectedTool("pencil")}} activated={selectedTool === "pencil"}/>
            <IconButton icon={<Slash/>} onClick={() => {setSelectedTool("line")}} activated={selectedTool === "line"}/>
            <IconButton icon={<RectangleHorizontalIcon/>} onClick={() => {setSelectedTool("rect")}} activated={selectedTool === "rect"}/>
            <IconButton icon={<Circle/>} onClick={() => {setSelectedTool("circle")}} activated={selectedTool === "circle"}/>
        </div>
    )
}
