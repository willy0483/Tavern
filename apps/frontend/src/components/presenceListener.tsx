"use client";
import { usePresence } from "@/hooks/usePresence";

const PresenceListener = ({
  userId,
  accessToken,
}: {
  userId: number;
  accessToken: string;
}) => {
  usePresence(userId, accessToken);
  return null;
};
export default PresenceListener;
