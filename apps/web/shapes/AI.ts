import { ShapeClass } from "./ShapeClass";
import { RectangleShape } from "./Rectangle";
import { CircleShape } from "./Circle";
import { LineShape } from "./Line";
import { Text } from "./Text";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { prompt_generator } from "../app/prompts/constant";
import { PencilShape } from "./Pencil";

export class AI_Draw extends ShapeClass {
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number, stroke?: string, fill?: string) {
        super(x, y, stroke, fill);
        this.height = height;
        this.width = width;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.stroke;
        ctx.fillStyle = this.fill;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }


    async fetchShapes(prompt: string) {
        try {
            const response = await axios.post(`${BACKEND_URL}/generate`, {
                "prompt": prompt_generator(prompt) + `Bounds : x=${this.x} ,y=${this.y} , width = ${this.width} , height=${this.height}`

            });

            if (!response) throw new Error(`Server error`);
            const data = await response.data
            console.log(data)
            return JSON.parse(data.result) || [];
        } catch (err) {
            console.error("Error fetching shapes:", err);
            return [];
        }
    }


    parseAndDrawShapes(shapes: any[], ctx: CanvasRenderingContext2D) {
        const instances = shapes.map(shape => {
            switch (shape.tool) {
                case "rectangle":
                    return new RectangleShape(shape.x, shape.y, shape.width, shape.height, shape.stroke, shape.fill);
                case "circle":
                    return new CircleShape(shape.x, shape.y, shape.radius, shape.stroke, shape.fill);
                case "line":
                    return new LineShape(shape.startX, shape.startY, shape.endX, shape.endY, shape.stroke);
                case "text":
                    return new Text(shape.x, shape.y, shape.content, shape.color, shape.font);
                case "pencil":
                    return new PencilShape(this.x,this.y,shape.points,shape.stroke,shape.fill)
                default:
                    console.warn("Unknown shape type:", shape.tool);
                    return null;
            }
        }).filter(Boolean);

        instances.forEach(shape => shape?.draw(ctx));
    }


    input(ctx: CanvasRenderingContext2D, socket : WebSocket,scale: number, offsetX: number, offsetY: number) {
        const existing = document.getElementById("ai-input-wrapper");
        if (existing) existing.remove();
        const rect = ctx.canvas.getBoundingClientRect();

        const screenX = rect.left + (this.x * scale + offsetX);
        const screenY = rect.top + (this.y * scale + offsetY);

        const wrapper = document.createElement("div");
        wrapper.id = "ai-input-wrapper";
        wrapper.style.position = "fixed";
        wrapper.style.left = `${screenX + 5}px`;
        wrapper.style.top = `${screenY + 5}px`;
        wrapper.style.zIndex = "1000";
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.gap = "5px";
        wrapper.style.background = "rgba(0,0,0,0.6)";
        wrapper.style.padding = "6px";
        wrapper.style.borderRadius = "6px";
        wrapper.style.width = `${this.width*scale - 10}px`;

        const input = document.createElement("input");
        input.placeholder = "Describe what to draw...";
        input.style.width = "100%";
        input.style.padding = "4px";
        input.style.font = "14px monospace";
        input.style.color = "white";
        input.style.background = "transparent";
        input.style.border = "1px solid gray";
        input.style.outline = "none";

        const button = document.createElement("button");
        button.textContent = "Generate";
        button.style.padding = "4px 8px";
        button.style.cursor = "pointer";
        button.style.fontSize = "13px";
        button.style.background = "white";

        wrapper.appendChild(input);
        wrapper.appendChild(button);
        document.body.appendChild(wrapper);
        input.focus();

        // When clicked on generate
        button.onclick = async () => {
            const prompt = input.value.trim();
            if (!prompt) return alert("Please enter a prompt!");

     
            button.textContent = "Generating...";
            button.disabled = true;

   

            console.log("Generating shapes for prompt:", prompt);
            try {
                const shapes = await this.fetchShapes(prompt);
                console.log(shapes)
                wrapper.remove();
                this.parseAndDrawShapes(shapes, ctx);
            } catch (err) {
                console.error("Error generating shapes:", err);
                alert("Failed to generate shapes. Please try again.");
            } finally {
                
                button.textContent = "Generate";
                button.disabled = false;
            }
        };

        const removeOnClick = (e: MouseEvent) => {
            if (!wrapper.contains(e.target as Node)) {
                wrapper.remove();
                window.removeEventListener("mousedown", removeOnClick);
            }
        };
        window.addEventListener("mousedown", removeOnClick);

     
    }
}
