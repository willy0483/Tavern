import { getHello } from "@/lib/actions/hello";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  const data = await getHello();

  if (!session) {
    redirect("/signin");
  }

  return (
    <main>
      <h1>Home</h1>
      <pre>Session: {JSON.stringify(session, null, 2)}</pre>
      <pre>Data: {JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
