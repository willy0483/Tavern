import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import { getSession } from "@/lib/session";
import PresenceListener from "@/components/presenceListener";
import BanListener from "@/components/banListener";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Tavern",
  description:
    "Tavern is a modern chat platform inspired by Discord, designed for communities and friends to connect, chat, and share.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Providers>
          <Toaster />
          {session?.user?.id && session.accessToken && (
            <>
              <PresenceListener
                userId={Number(session.user.id)}
                accessToken={session.accessToken}
              />
              <BanListener userId={Number(session?.user.id)} />
            </>
          )}
          {children}
        </Providers>
      </body>
    </html>
  );
}
