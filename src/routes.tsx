import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import Login from "./pages/authentication/login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthenticationLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "login",
        Component: Login,
      },
    ],
  },
]);

