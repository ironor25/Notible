export abstract class ShapeClass{
    x : number;
    y : number;
    stroke: string;
    fill: string;

    constructor(x:number,y:number,stroke="white",fill="transparent"){
        this.x = x
        this.y = y
        this.stroke = stroke
        this.fill  = fill

    }

    abstract draw(ctx : CanvasRenderingContext2D ): void
}