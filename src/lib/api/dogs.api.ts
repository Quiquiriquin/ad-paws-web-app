import { gql } from "@apollo/client";

export const COMPANY_DOGS = gql`
  query CompanyDogs($companyId: Int) {
    companyDogs(companyId: $companyId) {
      birthDate
      id
      ownerId
      breed
      color
      imageUrl
      name
      owner {
        id
        email
        phone
        name
        lastname
        profilePicture
      }
      size
      weight
      gender
    }
  }
`;

export const DOG_BY_ID = gql`
  query DogById($dogByIdId: Int) {
    dogById(id: $dogByIdId) {
      birthDate
      breed
      color
      id
      gender
      imageUrl
      name
      ownerId
      size
      weight
      owner {
        id
        gender
        profilePicture
        phone
        name
        lastname
        email
        birthDate
        status
      }
    }
  }
`;

export const CREATE_USER_DOGS = gql`
  mutation Mutation($input: CreateDogsInput!) {
    createDogs(input: $input) {
      breed
      color
      id
      gender
      name
      size
      weight
      birthDate
      imageUrl
    }
  }
`;
