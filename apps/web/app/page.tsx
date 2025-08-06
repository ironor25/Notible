"use client"

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Home from "./components/home";

export default function Main() {
  const { data: session, status } =  useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for session to load
    if (!session) {
      router.push("/signup");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // optional, or return a loader
  }

  return (
    <div>
      <Home />
    </div>
  );
}
