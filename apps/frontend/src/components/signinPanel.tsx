import Link from "next/link";

const SigninPanel = () => {
  return (
    <>
      <Link href={"/signin"}>Sign In</Link>
      <Link href={"/signup"}>Sign Up</Link>
    </>
  );
};
export default SigninPanel;
