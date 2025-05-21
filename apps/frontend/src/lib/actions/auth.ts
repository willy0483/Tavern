"use server";

import { redirect } from "next/navigation";
import { fetchGraphQL } from "../fetchGraphQL";
import { CREATE_USER_MUTATION, SIGN_IN_MUTATION } from "../gqlQueries";
import { SignUpFormState } from "../types/formState";
import { SignUpFormSchema } from "../zodSchemas/signUpFormSchema";
import { print } from "graphql";
import { LoginFormSchema } from "../zodSchemas/loginFormSchema";
import { revalidatePath } from "next/cache";
import { createSession } from "../session";

export const signup = async (
  state: SignUpFormState,
  fromData: FormData
): Promise<SignUpFormState> => {
  const vaildatedFields = SignUpFormSchema.safeParse(
    Object.fromEntries(fromData.entries())
  );

  if (!vaildatedFields.success) {
    return {
      data: Object.fromEntries(fromData.entries()),
      errors: vaildatedFields.error.flatten().fieldErrors,
    };
  }

  const data = await fetchGraphQL(print(CREATE_USER_MUTATION), {
    input: {
      ...vaildatedFields.data,
    },
  });

  if (data.errors) {
    return {
      data: Object.fromEntries(fromData.entries()),
      message: "Something went wrong",
    };
  }
  redirect("/signin");
};

export const signIn = async (
  state: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> => {
  const validatedFields = LoginFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let data;
  try {
    data = await fetchGraphQL(print(SIGN_IN_MUTATION), {
      input: {
        ...validatedFields.data,
      },
    });
  } catch (error) {
    let message = "Invalid Credentials";
    if (error instanceof Error) {
      message = error.message || message;
    }
    return {
      data: Object.fromEntries(formData.entries()),
      message,
      errors: {},
    };
  }

  console.log("SignIn Data: ", data.signIn);

  await createSession({
    user: {
      id: data.signIn.id,
      name: data.signIn.name,
      avatar: data.signIn.avatar,
    },
    accessToken: data.signIn.accessToken,
    refreshToken: data.signIn.refreshToken,
  });

  revalidatePath("/");
  redirect("/");
};
