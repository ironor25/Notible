import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(token:string){
    const [loading, setLoading] = useState(true);
    const [socket , setSocket] = useState<WebSocket>();


    useEffect(()=>{
    if (!token ) return;
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen=()=>{
            setLoading(false);
            setSocket(ws);
        }
    },[token]);

    return {
        socket,
        loading
    }
}