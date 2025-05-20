import { BACKEND_URL } from "./constants";

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
  if (result.errors) {
    console.error("Graphql errors:", result.errors);
    const message =
      result.errors[0]?.message || "Failed to fetch the data from GraphQL";
    throw new Error(message);
  }

  return result.data;
};
