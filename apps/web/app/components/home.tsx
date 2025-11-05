"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export default function Home() {
  const { data: session, status } = useSession();
  const token = session?.user;
  const router = useRouter();
  const [roomId, setroomId] = useState("");

  async function handleclick(type: string) {
    console.log(roomId);
    if (type == "join_room") {
      const room = await axios.get(`${BACKEND_URL}/room/${roomId}`);
      console.log(room);
      if (room) {
        router.push(`/canvas/${room.data.id}`);
      }
    } else if (type == "create-room") {
      const response = await axios.post(
        `${BACKEND_URL}/create-room/`,
        {
          name: roomId,
        },
        {
          headers: {
            Authorization: `${session?.user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        router.push(`/canvas/${response.data.roomId}`);
      }
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#1e293b",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#334155",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
          padding: 28,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#6366f1",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            N
          </div>
          <h2 style={{ margin: 0, fontSize: 20, color: "#e2e8f0" }}>
            Welcome to Notible
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Join or create a room to get started
          </p>
        </div>

        <input
          type="text"
          className="w-full border-2 mb-4 p-3 rounded-lg bg-white text-black"
          value={roomId}
          onChange={(e) => {
            setroomId(e.target.value);
          }}
          placeholder="Enter Room ID"
          style={{
            display: "block",
            marginBottom: 16,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #475569",
            fontSize: 14,
            outline: "none",
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              handleclick("join_room");
            }}
            style={{
              flex: 1,
              padding: "10px 12px",
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Join Room
          </button>
          <button
            onClick={() => {
              handleclick("create-room");
            }}
            style={{
              flex: 1,
              padding: "10px 12px",
              background: "transparent",
              color: "#e2e8f0",
              border: "1px solid #475569",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}