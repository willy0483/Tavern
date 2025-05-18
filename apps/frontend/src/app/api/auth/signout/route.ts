import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const GET = async () => {
  await deleteSession();
  redirect("/");
};
