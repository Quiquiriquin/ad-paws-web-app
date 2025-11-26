import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `${import.meta.env.VITE_BACKEND_API_URL}/graphql`,
  }),
  cache: new InMemoryCache(),
});
