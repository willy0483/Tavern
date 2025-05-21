import { getHello } from "@/lib/actions/hello";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  console.log({ session: session });

  const data = await getHello();

  return (
    <main>
      <h1>Home</h1>
      <pre>Session: {JSON.stringify(session, null, 2)}</pre>
      <pre>Data: {JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
