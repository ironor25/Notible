import { ShapeClass } from "./ShapeClass";

export class LineShape extends ShapeClass{
    cursorX :number;
    cursorY: number;
    constructor(cursorX:number, cursorY : number ,x : number, y: number, stroke?: string, fill?: string){
        super(x,y,stroke,fill)
        this.cursorX = cursorX
        this.cursorY = cursorY
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.moveTo(this.cursorX,this.cursorY)
        ctx.lineTo(this.x,this.y)
        ctx.stroke()
    }
}