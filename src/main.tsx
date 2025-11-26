import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/api/apolloClient";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);
