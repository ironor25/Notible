
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./Icons";
import {Brain, Circle, Hand, Pencil, RectangleHorizontalIcon, Slash, Type} from "lucide-react"
import { InitDraw } from "../app/draw"; 
import { store } from "../redux/store";

type Shape =  "circle"| "rect"| "pencil" | "line" | "text" | "AI" | "pan"

export function Canvas({socket}:{ socket: WebSocket;}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setSelectedTool] =  useState<Shape>("rect")

    const [CanvasManager, setCanvasManager] = useState<InitDraw | null>(null);
    const roomId = store.getState().roomId
    useEffect(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return
       const draw = new InitDraw(canvas,socket);
        setCanvasManager(draw)
        return ()=> draw.cleanup()
        
    },[canvasRef,roomId]);

    return (
         <div style={{"overflow":"hidden"}} >
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
            <IconButton icon={<Hand/>} 
            onClick={() => {
                setSelectedTool("pan")
                draw?.setTool("pan")

            }} activated={selectedTool === "pencil"}/>
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

            <IconButton icon={<Type/>} 
            onClick={() => {
                setSelectedTool("text")
                draw?.setTool("text")
            }} 
                activated={selectedTool === "text"}/>
            
            <IconButton icon={<Brain/>} 
            onClick={() => {
                setSelectedTool("AI")
                draw?.setTool("AI")
            }} 
                activated={selectedTool === "AI"}/>
        </div>
    )
}
