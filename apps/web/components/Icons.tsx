import { ReactNode } from "react"


export function IconButton({
    icon,
    onClick,
    activated
}:{
    icon: ReactNode,
    onClick: () => void,
    activated : boolean
}) {
    return (
        <div className={`pointer rounded-md cursor-pointer border p-2 bg-black hover:bg-gray-700 ${activated ? "text-yellow-300  " : "text-white" }`}
        onClick={onClick}
        >
            {icon}
        </div>
    )   
    
}
