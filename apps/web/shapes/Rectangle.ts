import { ShapeClass } from "./ShapeClass";

export class RectangleShape extends ShapeClass{
    width : number
    height : number
    
    constructor(x : number, y: number, width : number, height:  number, stroke?: string, fill?: string){
        super(x,y,stroke,fill)
        this.height = height
        this.width  = width
    }
    
    draw(ctx: CanvasRenderingContext2D): void {
    
        ctx.strokeStyle = this.stroke;
        ctx.fillStyle = this.fill
        ctx.strokeRect(this.x,this.y,this.width,this.height);

    }
}
