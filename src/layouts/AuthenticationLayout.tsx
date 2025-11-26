import { Outlet } from "react-router-dom";

export default function AuthenticationLayout() {
  return (
    <div className="h-dvh w-full bg-background">
      <div className="h-full w-full flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
