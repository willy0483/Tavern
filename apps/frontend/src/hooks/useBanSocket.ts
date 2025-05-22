"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import io from "socket.io-client";

export const useBanSocket = (userId: number) => {
  useEffect(() => {
    if (!userId) return;
    const socket = io("http://localhost:8000");
    socket.emit("join", { room: `user_${userId}` });

    socket.on("userBanned", (data: { userId: number }) => {
      if (data.userId === userId) {
        redirect("/banned");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
};
