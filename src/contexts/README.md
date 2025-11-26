# Authentication System

A complete authentication system with token management, protected routes, and automatic redirection.

## Features

- 🔐 Token-based authentication (JWT)
- 🔄 Automatic token storage in localStorage
- 🛡️ Protected routes that require authentication
- 🌐 Public routes that redirect authenticated users
- 📍 Redirect back to original destination after login
- 🎯 TypeScript support with full type safety
- ⚡ Loading states during auth initialization

## Architecture

### Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Manages authentication state
   - Provides auth methods to the entire app
   - Handles token storage and retrieval

2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
   - Wraps routes that require authentication
   - Redirects to login if user is not authenticated
   - Shows loading state during auth check

3. **PublicRoute** (`src/components/PublicRoute.tsx`)
   - Wraps auth-related routes (login, register)
   - Redirects to home if user is already authenticated
   - Preserves intended destination for post-login redirect

4. **Auth Helpers** (`src/lib/auth.ts`)
   - Utility functions for token management
   - Storage key constants

## Setup

### 1. Wrap Your App with AuthProvider

The `AuthProvider` is already configured in `src/main.tsx`:

```tsx
import { AuthProvider } from "./contexts/AuthContext";

<AuthProvider>
  <RouterProvider router={routes} />
</AuthProvider>
```

### 2. Configure Routes

Routes are configured in `src/routes.tsx`:

```tsx
// Protected route example
{
  path: "/",
  element: (
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
  ),
}

// Public route example
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
}
```

## Usage

### Using the useAuth Hook

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout, updateUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Login Flow

See `src/pages/authentication/login.tsx` for a complete example:

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@apollo/client/react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [signInUser, { loading, data, error }] = useMutation(LOGIN_MUTATION);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (formData: LoginFormValues) => {
    signInUser({ variables: { input: formData } });
  };

  useEffect(() => {
    if (data?.signUser) {
      // Save tokens
      login({
        accessToken: data.signUser.accessToken,
        refreshToken: data.signUser.refreshToken,
      });

      // Redirect to intended destination or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [data, login, navigate, location]);

  return <LoginForm onSubmit={onSubmit} loading={loading} />;
}
```

### Logout Flow

```tsx
import { useAuth } from "@/contexts/AuthContext";

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // User will be automatically redirected to login by ProtectedRoute
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Accessing Tokens in API Calls

```tsx
import { getAccessToken } from "@/lib/auth";

// In your Apollo Client configuration
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});
```

## API Reference

### AuthContext

#### Types

```typescript
interface User {
  id?: string;
  email?: string;
  name?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens, userData?: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}
```

#### Methods

**`login(tokens: AuthTokens, userData?: User)`**
- Stores authentication tokens in localStorage
- Updates user state
- Optionally stores user data

**`logout()`**
- Clears all authentication data from localStorage
- Resets user state to null
- Triggers redirect to login page (via ProtectedRoute)

**`updateUser(userData: User)`**
- Updates user information in state and localStorage
- Use this after fetching updated user data

#### Properties

**`user: User | null`**
- Current user object
- `null` if not authenticated

**`isAuthenticated: boolean`**
- `true` if user is logged in
- `false` otherwise

**`isLoading: boolean`**
- `true` during initial auth check
- `false` once auth state is determined

### Helper Functions

**`getAccessToken(): string | null`**
- Returns the access token from localStorage
- Returns `null` if not found

**`getRefreshToken(): string | null`**
- Returns the refresh token from localStorage
- Returns `null` if not found

## Storage

The authentication system uses localStorage to persist:

- **accessToken** - JWT access token
- **refreshToken** - JWT refresh token
- **userData** - JSON stringified user object

### Storage Keys

```typescript
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";
```

## Flow Diagrams

### Login Flow

```
User visits protected route (/)
  ↓
Not authenticated
  ↓
Redirect to /auth/login (stores original location)
  ↓
User enters credentials
  ↓
Login mutation successful
  ↓
Save tokens with login()
  ↓
Redirect to original location (/)
```

### Logout Flow

```
User clicks logout button
  ↓
Call logout()
  ↓
Clear tokens and user data
  ↓
ProtectedRoute detects no auth
  ↓
Redirect to /auth/login
```

### Direct Login Page Visit (Already Authenticated)

```
User visits /auth/login
  ↓
Already authenticated
  ↓
PublicRoute redirects to /
```

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage. For enhanced security, consider:
   - Using httpOnly cookies for tokens
   - Implementing token refresh logic
   - Setting token expiration

2. **Token Refresh**: Implement automatic token refresh using the refresh token

3. **API Integration**: Always send access token with API requests

4. **Error Handling**: Handle expired tokens and invalid credentials appropriately

## Extending the System

### Adding More User Properties

Update the `User` interface in `src/contexts/AuthContext.tsx`:

```typescript
export interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: string;        // Add new property
  avatar?: string;      // Add new property
}
```

### Adding Role-Based Access

Create a new component for role-based protection:

```tsx
function RoleProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  if (!allowedRoles.includes(user?.role || "")) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
}
```

### Token Refresh Implementation

Add a refresh token function to AuthContext:

```typescript
const refreshAccessToken = useCallback(async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) return null;
  
  try {
    // Call your refresh token API
    const response = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    
    const data = await response.json();
    
    if (data.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      return data.accessToken;
    }
  } catch (error) {
    logout();
  }
  
  return null;
}, [logout]);
```

## Troubleshooting

### Users get redirected to login unexpectedly

- Check if tokens are being stored correctly
- Verify token hasn't expired
- Check browser console for errors during auth initialization

### Login doesn't redirect

- Verify the login mutation returns the correct data structure
- Check that `login()` is being called with valid tokens
- Ensure navigate is being called after successful login

### Loading state never ends

- Check for errors in auth initialization
- Verify localStorage is accessible
- Check browser console for errors

## Best Practices

1. Always check `isLoading` before checking `isAuthenticated`
2. Handle authentication errors gracefully
3. Show loading states during login/logout operations
4. Clear sensitive data on logout
5. Implement token refresh before tokens expire
6. Use HTTPS in production
7. Consider implementing 2FA for enhanced security

