"use client";

import { SubmitButton } from "@/components/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/actions/auth";
import { useActionState } from "react";

const SignUpForm = () => {
  const [state, action] = useActionState(signup, undefined);

  return (
    <form action={action} className="flex flex-col gap-2">
      {!!state?.message && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          defaultValue={state?.data?.name}
        ></Input>
      </div>

      {!!state?.errors?.name && (
        <p className="text-red-500 text-sm">{state.errors.name}</p>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="John@example.com"
          defaultValue={state?.data?.email}
        ></Input>
      </div>

      {!!state?.errors?.email && (
        <p className="text-red-500 text-sm">{state.errors.email}</p>
      )}

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          defaultValue={state?.data?.password}
        ></Input>
      </div>

      {!!state?.errors?.password && (
        <div className="text-sm text-red-500">
          <p>Password Must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <SubmitButton>Sign Up</SubmitButton>
    </form>
  );
};
export default SignUpForm;
