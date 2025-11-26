import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation SignInUser($input: SignInUserInput) {
    signUser(input: $input) {
      accessToken
      refreshToken
    }
  }
`;
