"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getSession, Session } from "@/lib/session";
import { toast } from "sonner";

const BannedPage = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        toast.error("You have been banned");
        const sessionData = await getSession();
        setSession(sessionData);
        if (!sessionData) {
          throw new Error();
        }
      } catch {
        redirect("/signin");
      }
    };
    fetchSession();
  }, []);

  const handleClick = () => {
    redirect("/api/auth/signout");
  };

  return (
    <main className="min-h-screen w-full bg-hearth text-parchment flex flex-col items-center justify-center p-10">
      <div className="bg-cask/80 rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center border border-parchment">
        <svg
          className="w-16 h-16 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="8"
            y1="8"
            x2="16"
            y2="16"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="16"
            y1="8"
            x2="8"
            y2="16"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <h1 className="text-3xl font-bold mb-2 text-center">
          You have been banned
        </h1>
        <p className="mb-4 text-center">
          {session
            ? `User: ${session.user?.name || "Unknown"}`
            : "Loading your session..."}
        </p>
        <p className="mb-6 text-center text-parchment/80">
          If you believe this is a mistake, please contact support.
        </p>
        <Button
          onClick={handleClick}
          className="w-32 hover:bg-cask border border-parchment"
        >
          Sign Out
        </Button>
      </div>
    </main>
  );
};

export default BannedPage;
