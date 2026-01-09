import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation SignInUser($input: SignInUserInput) {
    signUser(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const USER_QUERY = gql`
  query User {
    user {
      id
      email
      name
      company {
        id
        name
        uuid
        logoUrl
        ownerId
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      success
    }
  }
`;

export const CREATE_USER_CLIENT = gql`
  mutation Mutation($input: CreateUserInput) {
    createUser(input: $input) {
      user {
        id
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

export const GET_OWNERS_QUERY = gql`
  query CompanyDogOwners($companyId: Int) {
    companyDogOwners(companyId: $companyId) {
      id
      profilePicture
      email
      phone
      dogs {
        id
        imageUrl
        reservations {
          id
          createdAt
        }
        breed
        color
        name
      }
      status
    }
  }
`;
