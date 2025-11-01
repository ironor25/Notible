import { ShapeClass } from "./ShapeClass";

export class PencilShape extends ShapeClass {
  points: { x: number; y: number }[];

  constructor(x: number, y: number, points: { x: number; y: number }[], stroke?: string, fill?: string) {
    super(x, y, stroke, fill);
    this.points = points;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.points.length === 0) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);


    if (this.points.length === 1) {
      const p = this.points[0];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = this.stroke;
      ctx.fill();
      return;
    }

    for (let i = 1; i < this.points.length - 1; i++) {
      const curr = this.points[i];
      const next = this.points[i + 1];
      const xc = (curr.x + next.x ) / 2 ;
      const yc = (curr.y + next.y) / 2  ;
      ctx.quadraticCurveTo(curr.x, curr.y, xc, yc);
    }

    // Draw last segment
    const last = this.points[this.points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }
}
