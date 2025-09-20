"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useSession } from "next-auth/react";



export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

   const token = session?.user?.token ?? null;
   
  const { socket, loading: socketLoading } = useSocket(
    status === "authenticated" && token ? token : null
  );

  // Handle joining room and receiving messages
  useEffect(() => {
    if (!socket || socketLoading || status !== "authenticated") return;

    socket.send(
      JSON.stringify({
        type: "join_room",
        roomId: id,
      })
    );

    socket.onmessage = (event) => {
      console.log(event.data)
      const parsedData = JSON.parse(event.data);
      console.log(parsedData)
      if (parsedData.type === "chat") {
        setChats((prev) => [...prev, { message: parsedData.message }]);
      }
    };

  }, [socket, socketLoading, id, status]);

  // Session is still loading
  if (status === "loading") return <div>Loading session...</div>;

  // Session failed to load or token missing
  if (!token) return <div>You must be signed in to join the chat.</div>;

  return (
    <div>
      {chats.map((m, i) => (
        <div key={i}>{m.message}</div>
      ))}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />

      <button
        onClick={() => {
          if (!currentMessage.trim()) return;
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );
          setCurrentMessage("");
        }}
      >
        Send msg
      </button>
    </div>
  );
}
