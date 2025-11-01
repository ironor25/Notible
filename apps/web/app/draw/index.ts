import axios from "axios";
import { BACKEND_URL } from "../../config";
import { RectangleShape } from "../../shapes/Rectangle";
import { CircleShape } from "../../shapes/Circle";
import { LineShape } from "../../shapes/Line";
import { PencilShape } from "../../shapes/Pencil";
import { Text } from "../../shapes/Text";
import { AI_Draw } from "../../shapes/AI";
import { log } from "console";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  |
  {
    type: "line";
    cursorX: number;
    cursorY: number;
    x: number;
    y: number;
  }
  |
  {
    type: "pencil";
    strokehistory:[];
  }
  |
  {
    type: "text";
    text: "";
    x:number;
    y:number;
  }
  |
  {
    type: "AI"
    x: number;
    y: number;
    width: number;
    height: number;
  }

export type ToolType = "circle" | "rect" | "line" | "pencil" | "text" | "AI" | "pan" |null;

export class InitDraw {
  
  private canvas: HTMLCanvasElement;
  private roomId: string;
  private socket: WebSocket;
  private ctx: CanvasRenderingContext2D;
  private isDrawing: boolean = false;
  private existingShapes: Shape[] = [];
  private startX = 0;
  private startY = 0;
  private current_tool: ToolType = "rect";
  private points : {x:number,y:number}[] = []
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;
  private isPanning = false;
  private panStartX = 0;
  private panStartY = 0;



  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    console.log("InitDraw started")
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas context not defined");
    this.canvas = canvas;
    this.roomId = roomId;
    this.socket = socket;
    this.ctx = ctx;
    
    this.loadExistingShapes();
    this.setupSocket();
    this.handleEventListeners();
   
  }

  private async loadExistingShapes() {
    const res = await axios.get(`${BACKEND_URL}/chats/${this.roomId}`);
    const messages = res.data.messages;
    this.existingShapes = messages.map((x: { message: string }) => {
      const messageData = JSON.parse(x.message);

      return messageData;
    });

    this.clearCanvas();
  }

  private async setupSocket() {
    this.socket.onmessage = (event) => {
    let message: any;
    try {
      message = JSON.parse(event.data);
    } catch {
      console.warn("Non-JSON message from server:", event.data);
      return;
    }
    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      this.existingShapes.push(parsedShape);
      this.clearCanvas();
    }
    };
  }

  private getTransformedCoords(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;
    return { x, y };
}


  private async handleEventListeners() {
    const mouseDownEvent = (e: MouseEvent) => {
      this.isDrawing = true;
      const { x, y } = this.getTransformedCoords(e);
    
      this.startX = x;
      this.startY = y;
      

    };

    const mouseUpEvent = (e: MouseEvent) => {
     
      if (!this.isDrawing) return;
      this.isDrawing = false;

      const { x, y } = this.getTransformedCoords(e);
      const width = x - this.startX;
      const height = y - this.startY;
      let shape: any = {};
      switch (this.current_tool) {

        case "rect":
          shape = {
            type: "rect",
            x: this.startX,
            y: this.startY,
            width: width,
            height: height,
          };
          break;

        case "circle":
          const radius = Math.sqrt(width*width + height*height)/2
          shape = {
            type: "circle",
            centerX: this.startX + width/2,
            centerY: this.startY + height/2,
            radius: Math.abs(radius),
          };
          break;
          
        case "line":
          shape = {
            type:"line",
            cursorX: this.startX,
            cursorY: this.startY,
            x: x,
            y: y
          }
          break;
        
        case "pencil":
          shape = {
            type:"pencil",
            strokehistory: this.points
            
          }
          this.points = []

          break

        case "text":
          console.log("reached text")
          new Text(this.startX,this.startY).draw(this.ctx)
          shape = {
            type:"text",
            text: "",
            x:this.startX,
            y:this.startY
          }

        case "AI" : 
        // console.log(height,width)
          if (width <= 100 && height <= 100){
              alert("Draw area more that a regualr eraser")
              break
          }
          new AI_Draw(this.startX,this.startY,width,height).input(this.ctx, this.socket,this.scale, this.offsetX, this.offsetY)
          

        default:
          return;
      }




      this.existingShapes.push(shape);
      this.clearCanvas();

      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify(shape),
          roomId: this.roomId,
        })
      );
    };

    const mouseMoveEvent = (e: MouseEvent) => {
      if (!this.isDrawing) return;
  
      const { x, y } = this.getTransformedCoords(e);
      const width = x - this.startX;
      const height = y - this.startY;
      this.clearCanvas();
      if (this.current_tool == "rect") {
        new RectangleShape(
          this.startX,
          this.startY,
          width,
          height
        ).draw(this.ctx);
      } else if (this.current_tool == "circle") {
        const radius = Math.sqrt(width*width + height*height)/2
        const centerX = this.startX + width/2;
        const centerY = this.startY + height/2;

        new CircleShape(centerX, centerY, Math.abs(radius)).draw(this.ctx);
      }
      else if (this.current_tool == "line"){
        new LineShape(this.startX,this.startY,x,y).draw(this.ctx)
      }

      else if (this.current_tool == "pencil"){
        //@ts-ignore
        this.points.push({x:x,y:y})
        new PencilShape(this.startX,this.startY,this.points).draw(this.ctx)
      }
      else if (this.current_tool ==  "AI"){
        
        new AI_Draw(
          this.startX,
          this.startY,
          width,
          height
        ).draw(this.ctx);
      }
    };

    const moveCanvasDown = (e : MouseEvent) => {
        if (this.current_tool == "pan"){
          this.isPanning = true
          this.panStartX = e.clientX - this.offsetX
          this.panStartY = e.clientY - this.offsetY
        };
      }
      
      const moveCanvasMove= (e: MouseEvent) =>{
          if(!this.isPanning) return;
          this.offsetX = e.clientX - this.panStartX;
          this.offsetY = e.clientY - this.panStartY;
          this.clearCanvas()
      }
      const panMouseUp = () => {
          if (!this.isPanning) return
          this.isPanning = false;
      };
      
      const zoomHandler = (e: WheelEvent) =>{
        if (!e.ctrlKey) return;
          e.preventDefault();

          const zoomIntensity = 0.001;
          const delta = -e.deltaY * zoomIntensity;
          const newScale = this.scale * (1 + delta);


          const clampedScale = Math.min(Math.max(newScale, 0.3), 3);

          const rect = this.canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;


          const worldX = (mouseX - this.offsetX) / this.scale;
          const worldY = (mouseY - this.offsetY) / this.scale;

       
          this.offsetX = mouseX - worldX * clampedScale;
          this.offsetY = mouseY - worldY * clampedScale;

          this.scale = clampedScale;
          this.clearCanvas();
      }

    this.canvas.addEventListener("mousedown", mouseDownEvent);
    this.canvas.addEventListener("mouseup", mouseUpEvent);
    this.canvas.addEventListener("mousemove", mouseMoveEvent);
    this.canvas.addEventListener("mousedown", moveCanvasDown);
    this.canvas.addEventListener("mousemove", moveCanvasMove);
    this.canvas.addEventListener("mouseup", panMouseUp);
    this.canvas.addEventListener("wheel", zoomHandler);


    const cleanup = () => {
      this.canvas.removeEventListener("mousedown", mouseDownEvent);
      this.canvas.removeEventListener("mouseup", mouseUpEvent);
      this.canvas.removeEventListener("mousemove", mouseMoveEvent);
    };
    this.cleanup = cleanup;
  }

  private clearCanvas() {
    
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
    
    this.existingShapes.map((shape) => {
      if (shape.type == "rect") {
        new RectangleShape(shape.x, shape.y, shape.width, shape.height).draw(this.ctx);

      } else if (shape.type == "circle") {
        new CircleShape(shape.centerX, shape.centerY, shape.radius).draw(this.ctx);
      }

      else if (shape.type == "line"){
        new LineShape(shape.cursorX,shape.cursorY,shape.x,shape.y).draw(this.ctx)
      }

      else if (shape.type == "pencil"){
        //@ts-ignore
        new PencilShape(this.startX,this.startY ,shape.strokehistory).draw(this.ctx)
      }

      else if (shape.type == "text"){
        //@ts-ignore
        new PencilShape(this.startX,this.startY ,shape.strokehistory).draw(this.ctx)
      }

      else if (this.current_tool ==  "AI"){
        
        new AI_Draw(shape.x, shape.y, shape.width, shape.height).draw(this.ctx);
      };
      
      
    });
  }

  setTool(tool: ToolType) {
    this.current_tool = tool;
  }

  cleanup() {}
}
