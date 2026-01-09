import { gql } from "@apollo/client";

export const GET_GUEST_STATS = gql`
  query Query {
    guestsStats {
      newDogsDuringMonth
      pastDueVaccines
      todayCheckedInDogs
      totalDogs
    }
  }
`;
