import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// HTTP connection to the API
const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_BACKEND_API_URL}/graphql`,
  credentials: "include",
});

// Auth link to add token to headers
// const authLink = setContext((_, { headers }) => {
//   // Get the authentication token from local storage if it exists
//   const token = getAccessToken();

//   // Return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
