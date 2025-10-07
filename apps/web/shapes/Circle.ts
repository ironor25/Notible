import { Pi } from "lucide-react";
import { ShapeClass } from "./ShapeClass";

export  class CircleShape extends ShapeClass{
    radius:  number;

    constructor(x: number, y: number, radius: number, stroke?: string, fill?: string){
        super(x,y,stroke,fill);
        this.radius = radius

    }

    draw(ctx: CanvasRenderingContext2D) {
        
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
        ctx.stroke()
        ctx.closePath()
    }
}