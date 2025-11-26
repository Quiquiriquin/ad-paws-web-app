import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { Button } from "./components/ui/button";
import { useAuth } from "./contexts/AuthContext";

export const App = () => {
  const [count, setCount] = useState(0);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="flex justify-end p-4">
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right">
              {user.name && <p className="text-sm font-medium">{user.name}</p>}
              {user.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
          )}
          <Button onClick={handleLogout} variant="outline">
            Cerrar sesión
          </Button>
        </div>
      </div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Button>Hola, este es un botón</Button>
    </>
  );
};
