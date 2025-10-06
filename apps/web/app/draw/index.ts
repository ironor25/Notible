import axios from "axios";
import { BACKEND_URL } from "../../config";
import { RectangleShape } from "../../shapes/Rectangle";
import { CircleShape } from "../../shapes/Circle";


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
    };

export type ToolType = "circle" | "rect" | null;


export class InitDraw{
  private canvas : HTMLCanvasElement;
  private roomId : string;
  private socket : WebSocket;
  private ctx  : CanvasRenderingContext2D;
  private isDrawing : boolean  = false
  private existingShapes  : Shape[] = [];
  private startX = 0 ;
  private startY = 0 ;
  private current_tool : ToolType = "rect";

  constructor(canvas : HTMLCanvasElement,roomId : string,socket : WebSocket){

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas context not defined")
    
    this.canvas = canvas
    this.roomId = roomId
    this.socket = socket
    this.ctx = ctx


    this.loadExistingShapes()
    this.setupSocket()
    this.handleEventListeners();
  }

  private async loadExistingShapes(){
      const res = await axios.get(`${BACKEND_URL}/chats/${this.roomId}`);
      const messages = res.data.messages
      this.existingShapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
        
        return messageData;
      });

  }

  private async setupSocket(){
    this.socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      this.existingShapes.push(parsedShape);
      this.clearCanvas();
    }
  };
  }

  private async handleEventListeners(){
    
    
    const mouseDownEvent = (e : MouseEvent) => {
          this.isDrawing = true;
          this.startX = e.clientX
          this.startY = e.clientY
    }

    const mouseUpEvent = (e : MouseEvent)=>{
        if (!this.isDrawing) return ;
        this.isDrawing = false;

        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        let shape : any;
        switch (this.current_tool){
            case ("rect"):
                shape = {
                  type: "rect",
                  x: this.startX,
                  y: this.startY,
                  width: width,
                  height: height,
                }
                break;

            case ("circle"):
                const radius  = Math.max(width,height)/2;
                shape = {
                  type: "circle",
                  centerX: this.startX + Math.abs(radius),
                  centerY: this.startY + Math.abs(radius),
                  radius : Math.abs(radius)
                  
                }
                break;

            default:
              return;
        }

        this.existingShapes.push(shape);
        this.clearCanvas();

        this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify(
            shape
          ),
          roomId:this.roomId,
        })
      );
    }

    const mouseMoveEvent =  (e : MouseEvent)=>{
            if (!this.isDrawing) return;

            const currX = e.clientX - this.startX;
            const currY = e.clientY - this.startY;
            this.clearCanvas();
            if (this.current_tool == "rect") {
             
               const preview  = new RectangleShape(this.startX,this.startY,currX,currY).draw(this.ctx)
               
              }
            else if (this.current_tool == "circle"){
            
              const radius = Math.max(currX,currY)/2;
              const centerX = this.startX + radius
              const centerY = this.startY + radius
              
              new CircleShape(centerX,centerY,Math.abs(radius)).draw(this.ctx)
            
            }
      }
    this.canvas.addEventListener("mousedown" ,mouseDownEvent);
    this.canvas.addEventListener("mouseup", mouseUpEvent);
    this.canvas.addEventListener("mousemove", mouseMoveEvent);

    const cleanup = () => {
    this.canvas.removeEventListener("mousedown" ,mouseDownEvent);
    this.canvas.removeEventListener("mouseup", mouseUpEvent);
    this.canvas.removeEventListener("mousemove", mouseMoveEvent);

   
  }
   this.cleanup = cleanup

  }

  private clearCanvas(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.existingShapes.map((shape) => {
      if (shape.type == "rect") {
        new RectangleShape(shape.x,shape.y,shape.width,shape.height).draw(this.ctx)
      
       
      }
      else if (shape.type == "circle"){

         new CircleShape(shape.centerX,shape.centerY,shape.radius).draw(this.ctx)
       
      }

  });
  }

  setTool(tool: ToolType){
    this.current_tool = tool;

  }

  cleanup(){}
  


}

  
