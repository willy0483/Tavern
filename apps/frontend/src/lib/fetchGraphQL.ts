"use server";
import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import {
  IS_USER_BANNED_MUTATION,
  REFRESH_ACCESSTOKEN_MUTATION,
} from "./gqlQueries";
import { getSession } from "./session";
import { print } from "graphql";

export const fetchGraphQL = async (query: string, variables = {}) => {
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();
  return result.data;
};

export const fetchWithAuth = async (query: string, variables = {}) => {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
    return;
  }

  // Ban check
  const banResponse = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({
      query: print(IS_USER_BANNED_MUTATION),
      variables: { isUserBannedInput: { userId: Number(session.user.id) } },
    }),
  });

  const banResult = await banResponse.json();

  if (banResult?.data?.isUserBanned) {
    redirect("/banned");
    return;
  }

  // Main request
  let response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  let result = await response.json();

  // Handle unauthorized error and try refresh
  if (
    result?.errors &&
    result.errors[0]?.message === "Unauthorized" &&
    session.refreshToken
  ) {
    const refreshResult = await fetch(`${BACKEND_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: print(REFRESH_ACCESSTOKEN_MUTATION),
        variables: { refreshToken: session.refreshToken },
      }),
    }).then((res) => res.json());

    if (
      refreshResult?.errors?.[0]?.message === "Invalid refresh token" ||
      !refreshResult?.data?.refreshAccessToken
    ) {
      redirect("/api/auth/signout");
      return;
    }

    session.accessToken = refreshResult.data.refreshAccessToken;

    response = await fetch(`${BACKEND_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    result = await response.json();
  }

  return result.data;
};
