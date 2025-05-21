import gql from "graphql-tag";

export const CREATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation signIn($input: SignInInput!) {
    signIn(signInInput: $input) {
      id
      name
      avatar
      isBanned
      accessToken
      refreshToken
    }
  }
`;

export const REFRESH_ACCESSTOKEN_MUTATION = gql`
  mutation refreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken)
  }
`;

export const HELLO_QUERY = gql`
  query {
    hello
  }
`;
