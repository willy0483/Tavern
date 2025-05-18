import Link from "next/link";
import SignInForm from "./_components/signInForm";

const SignInPage = () => {
  return (
    <div className="bg-white p-8 border rounded-md shadow-md w-96 flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl font bold mb-4">Sign In Page</h1>
      <SignInForm />
      <Link href={"/auth/forgot"}>Forgot Your Password?</Link>
    </div>
  );
};
export default SignInPage;
