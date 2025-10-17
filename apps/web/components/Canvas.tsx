import { useEffect, useRef, useState } from "react";
import { IconButton } from "./Icons";
import {Circle, Pencil, RectangleHorizontalIcon, Slash} from "lucide-react"
import { InitDraw } from "../app/draw"; 

type Shape =  "circle"| "rect"| "pencil" | "line"

export function Canvas({roomId,socket}:{roomId:string; socket: WebSocket;}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setSelectedTool] =  useState<Shape>("rect")

    const [CanvasManager, setCanvasManager] = useState<InitDraw | null>(null);
    
    useEffect(()=>{
        const canvas = canvasRef.current;
        console.log(canvas)
        if (!canvas) return
        console.log(socket.readyState)
        const draw = new InitDraw(canvas,roomId,socket);
        console.log(socket.readyState)
        setCanvasManager(draw)
        return ()=> draw.cleanup()
        
    },[canvasRef,roomId,socket]);

    return (
         <div style={{"overflow":"hidden"}}>
            <canvas ref = {canvasRef} width={window.innerWidth} height={window.innerHeight} />
            <TopIconBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} draw={CanvasManager}/>
         </div>
    )
}



function TopIconBar({selectedTool,setSelectedTool,draw}:
    {
        selectedTool: Shape,
        setSelectedTool: (s: Shape) => void,
        draw : InitDraw | null
    }
){


   
    return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex gap-2 overflow-hidden" >
            <IconButton icon={<Pencil/>} 
            onClick={() => {
                setSelectedTool("pencil")
                draw?.setTool("pencil")

            }} activated={selectedTool === "pencil"}/>
            <IconButton icon={<Slash/>} 
            onClick={() => {
                setSelectedTool("line")
                draw?.setTool("line")
            }} 
                activated={selectedTool === "line"}/>
            <IconButton icon={<RectangleHorizontalIcon/>} 
            onClick={() => {
                setSelectedTool("rect")
                draw?.setTool("rect")
            }} 
                activated={selectedTool === "rect"}/>
            <IconButton icon={<Circle/>} 
            onClick={() => {
                setSelectedTool("circle")
                draw?.setTool("circle")
            }} 
                activated={selectedTool === "circle"}/>
        </div>
    )
}
