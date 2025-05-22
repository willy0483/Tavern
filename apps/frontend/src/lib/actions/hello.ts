import { fetchWithAuth } from "../fetchGraphQL";
import { HELLO_QUERY } from "../gqlQueries";
import { print } from "graphql";

export const getHello = async () => {
  const data = await fetchWithAuth(print(HELLO_QUERY));
  return data;
};
