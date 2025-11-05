import { ImageUp } from "lucide-react";
import { ShapeClass } from "./ShapeClass";

export class Text extends ShapeClass{
    font_size : number
    constructor (x: number,y:number,font_size = 20, stroke?: string, fill?: string){
        super(x,y,stroke,fill)
        this.font_size = font_size
    }



    draw(ctx: CanvasRenderingContext2D): void {

        let input = document.createElement("input")
        input.style.position = "fixed";
        input.style.left = `${this.x}px`;
        input.style.top = `${this.y}px`;
        input.id = "text-input"
        // style it to make visible
        input.style.zIndex = "1000";
        input.style.color = "white"
        input.style.font = "16px cursive";
        input.style.outline = "none";
        document.body.appendChild(input)
        input.focus()


        ctx.fillText(input.value,this.x,this.y)
        document.removeChild
          
    }
}
    