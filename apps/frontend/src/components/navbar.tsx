import { getSession } from "@/lib/session";
import SigninPanel from "./signinPanel";
import Profile from "./profile";

const Navbar = async () => {
  const session = await getSession();

  return (
    <nav className="flex justify-between">
      <h1 className="text-2xl font-blod p-2">Tavern</h1>
      <div className="md:ml-auto px-2 flex flex-col md:flex-row gap-2 md:items-center md:justify-center [&>a:hover]:bg-sky-500 [&>a:hover]:text-sky-100 [&>a]:rounded-md [&>a]:transition [&>a]:duration-200 [&>a]:px-4 md:[&>a]:py-2 [&>a]:py-1 ">
        {session && session.user ? (
          <Profile user={session.user} />
        ) : (
          <SigninPanel />
        )}
      </div>
    </nav>
  );
};
export default Navbar;
