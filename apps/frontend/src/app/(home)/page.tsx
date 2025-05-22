import BanListener from "@/components/banListener";
import { getHello } from "@/lib/actions/hello";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  const data = await getHello();

  return (
    <main>
      <BanListener userId={Number(session?.user.id) || 0} />
      <h1>Home</h1>
      <pre>Session: {JSON.stringify(session, null, 2)}</pre>
      <pre>Data: {JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
