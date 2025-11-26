import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes.ts";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/api/apolloClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={routes} />
    </ApolloProvider>
  </StrictMode>
);
