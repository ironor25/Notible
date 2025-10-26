import { ShapeClass } from "./ShapeClass";

export class AI_Draw extends ShapeClass{
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

    input() {
    const existing = document.getElementById("ai-input-wrapper");
    if (existing) existing.remove();

    // create wrapper
    const wrapper = document.createElement("div");
    wrapper.id = "ai-input-wrapper";
    wrapper.style.position = "fixed";
    wrapper.style.left = `${this.x + 5}px`;
    wrapper.style.top = `${this.y + 5}px`;
    wrapper.style.zIndex = "1000";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "5px";
    wrapper.style.background = "rgba(0,0,0,0.6)";
    wrapper.style.padding = "6px";
    wrapper.style.borderRadius = "6px";
    wrapper.style.width = `${this.width - 10}px`;

    // create input
    const input = document.createElement("input");
    input.placeholder = "Describe what to draw...";
    input.style.width = "100%";
    input.style.padding = "4px";
    input.style.font = "14px monospace";
    input.style.color = "white";
    input.style.background = "transparent";
    input.style.border = "1px solid gray";
    input.style.outline = "none";

    // create button
    const button = document.createElement("button");
    button.textContent = "Generate";
    button.style.padding = "4px 8px";
    button.style.cursor = "pointer";
    button.style.fontSize = "13px";
    button.style.background = "white";
    

    // append to wrapper
    wrapper.appendChild(input);
    wrapper.appendChild(button);
    document.body.appendChild(wrapper);

    input.focus();

    // handle generate click
    button.onclick = () => {
        const prompt = input.value.trim();
        if (!prompt) return alert("Please enter a prompt!");
        console.log("Generating with prompt:", prompt);
        console.log("Coordinates:", {
            x: this.x, y: this.y, width: this.width, height: this.height,
        });

        // later you’ll call AI draw logic here
        wrapper.remove();
    };

    // remove if clicked outside
    const removeOnClick = (e: MouseEvent) => {
        if (!wrapper.contains(e.target as Node)) {
            wrapper.remove();
            window.removeEventListener("mousedown", removeOnClick);
        }
    };
    window.addEventListener("mousedown", removeOnClick);
        
    }
}

