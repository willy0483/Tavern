"use server";
import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { REFRESH_ACCESSTOKEN_MUTATION } from "./gqlQueries";
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

export const authFetchGraphQL = async (query: string, variables = {}) => {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  let response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  let result = await response.json();
  if (
    result?.errors &&
    result?.errors[0]?.message === "Unauthorized" &&
    session?.refreshToken
  ) {
    const refreshResult = await fetchGraphQL(
      print(REFRESH_ACCESSTOKEN_MUTATION),
      {
        refreshToken: session.refreshToken,
      }
    );

    if (refreshResult?.errors?.[0]?.message === "Invalid refresh token") {
      redirect("/signin");
      return;
    }

    if (!refreshResult || !refreshResult.refreshAccessToken) {
      redirect("/signin");
      return;
    }

    console.log("new accessToken", refreshResult);

    session.accessToken = refreshResult.refreshAccessToken;

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
