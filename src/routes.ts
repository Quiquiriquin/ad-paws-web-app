import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import Login from "./pages/authentication/login";

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/auth",
    Component: AuthenticationLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
    ],
  },
]);
