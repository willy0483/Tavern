"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const BannedPage = () => {
  useEffect(() => {
    toast.error("You have been banned");
  }, []);

  const handleClick = () => {
    redirect("/signin");
  };

  return (
    <main>
      <h1>You have been banned</h1>
      <p>If you think this is a mistake, please contact support.</p>
      <Button onClick={() => handleClick}>SignIn</Button>
    </main>
  );
};

export default BannedPage;
