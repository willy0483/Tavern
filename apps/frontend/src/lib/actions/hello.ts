import { authFetchGraphQL } from "../fetchGraphQL";
import { HELLO_QUERY } from "../gqlQueries";
import { print } from "graphql";

export const getHello = async () => {
  const data = await authFetchGraphQL(print(HELLO_QUERY));

  console.log("getHello: ", data);
  return data;
};
