import { Pencil } from "lucide-react";
import { ShapeClass } from "./ShapeClass";

export class PencilShape extends ShapeClass{
    points : {x:number,y:number}[] = []
    constructor (x : number, y: number, stroke?: string, fill?: string){
        super(x,y)
        this.addPoint(x,y)
    }
     addPoint(x: number, y: number) {
        this.points.push({ x, y });
    }


    draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = 2
        if (this.points.length == 0) return;
        
        if (this.points.length < 2){
            ctx.strokeStyle= this.stroke
            const p = this.points[0]
            ctx.beginPath()
            ctx.arc(p?.x || 0,p?.y || 0,0,ctx.lineWidth,Math.PI*2)
            ctx.stroke()
        }

        ctx.strokeStyle = this.stroke
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
    
        ctx.beginPath()
        ctx.moveTo(this.x,this.y)
    
    
    }

}