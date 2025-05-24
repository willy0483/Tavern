import { useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";

export const usePresence = (userId: number, accessToken: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socketRef = useRef<any>(null);
  const activityTimeout = useRef<number | undefined>(undefined);
  const afkTimeout = 5 * 60 * 1000; // 5 minutes
  const wasAfk = useRef(false);

  const resetActivityTimer = useCallback(() => {
    if (wasAfk.current) {
      socketRef.current?.emit("active");
      wasAfk.current = false;
    }
    if (activityTimeout.current !== undefined) {
      window.clearTimeout(activityTimeout.current);
    }
    activityTimeout.current = window.setTimeout(() => {
      socketRef.current?.emit("afk");
      wasAfk.current = true;
    }, afkTimeout);
  }, [afkTimeout]);

  useEffect(() => {
    if (!userId || !accessToken) return;

    const socket = io("http://localhost:8000", {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to presence gateway");
      resetActivityTimer();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from presence gateway");
    });

    const events = ["mousemove", "keydown", "click", "scroll"];
    for (const event of events) {
      window.addEventListener(event, resetActivityTimer);
    }

    const heartbeatInterval = setInterval(() => {
      socket.emit("heartbeat");
    }, 30000);

    return () => {
      clearInterval(heartbeatInterval);
      socket.disconnect();
      for (const event of events) {
        window.removeEventListener(event, resetActivityTimer);
      }
      if (activityTimeout.current !== undefined) {
        window.clearTimeout(activityTimeout.current);
      }
    };
  }, [userId, accessToken, resetActivityTimer]);
};
