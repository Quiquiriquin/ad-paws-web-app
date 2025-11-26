# Authentication Context - User Data Fetching

## Overview

The AuthContext has been enhanced to automatically fetch user information from the API when authentication tokens are present.

## How It Works

### 1. On App Load (Initialization)

```typescript
// When the app loads, AuthContext checks localStorage for tokens
useEffect(() => {
  const initializeAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (accessToken && refreshToken) {
      // Automatically fetch user data from API
      await fetchUserData(); // Calls USER_QUERY
    }
    
    setIsLoading(false);
  };
  
  initializeAuth();
}, []);
```

### 2. On Login

```typescript
// After successful login with tokens
await login({
  accessToken: "jwt_token",
  refreshToken: "refresh_token"
});

// Login function automatically:
// 1. Stores tokens in localStorage
// 2. Calls USER_QUERY to fetch user data
// 3. Updates user state with fetched data
// 4. Stores user data in localStorage for offline access
```

### 3. User Data Structure

The USER_QUERY fetches:

```graphql
query User {
  user {
    id
    email
    name
  }
}
```

## Features

✅ **Automatic Fetching**: User data is fetched automatically when tokens exist  
✅ **Fresh Data**: Always fetches from network on initialization  
✅ **Error Handling**: Clears tokens if user fetch fails (e.g., expired token)  
✅ **Offline Cache**: Stores user data in localStorage  
✅ **Manual Refetch**: `refetchUser()` method available

## API Methods

### refetchUser()

Manually refetch user data from the API:

```typescript
const { refetchUser } = useAuth();

// After updating user profile
await refetchUser();
```

### login(tokens, userData?)

Login with tokens and optionally provide user data:

```typescript
// Option 1: Auto-fetch user data (recommended)
await login({ accessToken, refreshToken });

// Option 2: Provide user data directly (skips API call)
await login(
  { accessToken, refreshToken },
  { id: "1", email: "user@example.com", name: "John Doe" }
);
```

## Flow Diagram

```
App Starts
  ↓
Check localStorage for tokens
  ↓
Tokens found? ──No──> Set isLoading = false
  ↓ Yes               Show login page
  ↓
Call USER_QUERY ──Error──> Clear tokens
  ↓                         Set isLoading = false
Success                     Show login page
  ↓
Update user state
Update localStorage
Set isLoading = false
Show protected content
```

## Error Handling

### Token Expired

```typescript
// If USER_QUERY fails (e.g., 401 Unauthorized):
// 1. Clear all auth data
localStorage.removeItem("accessToken");
localStorage.removeItem("refreshToken");
localStorage.removeItem("userData");

// 2. Set user to null
setUser(null);

// 3. User is redirected to login by ProtectedRoute
```

### Network Error

```typescript
// If network error occurs:
// - Error is logged to console
// - Auth data is cleared
// - User is redirected to login
```

## Usage Examples

### Display User Information

```tsx
function UserProfile() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>{user?.name || "Anonymous"}</h1>
      <p>{user?.email}</p>
      <p>ID: {user?.id}</p>
    </div>
  );
}
```

### Refetch After Profile Update

```tsx
function UpdateProfile() {
  const { refetchUser } = useAuth();
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  
  const handleUpdate = async (data) => {
    await updateUser({ variables: { input: data } });
    
    // Refetch user data to get latest info
    await refetchUser();
  };
  
  return <form onSubmit={handleUpdate}>...</form>;
}
```

### Check User Data Availability

```tsx
function ConditionalRender() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }
  
  if (!user?.name) {
    return <div>Loading profile...</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

## Benefits

1. **Always Fresh Data**: User data is fetched on every app load
2. **Better UX**: Shows actual user name and profile info
3. **Security**: Invalid/expired tokens are automatically detected and cleared
4. **Consistency**: User data is synced with backend
5. **Offline Support**: Cached user data available immediately

## Configuration

### Extending User Type

Add more fields to the User interface:

```typescript
// src/contexts/AuthContext.tsx
export interface User {
  id?: string;
  email?: string;
  name?: string;
  avatar?: string;      // Add new field
  role?: string;        // Add new field
  createdAt?: string;   // Add new field
}
```

### Update Query

```typescript
// src/lib/api/user.api.ts
export const USER_QUERY = gql`
  query User {
    user {
      id
      email
      name
      avatar    # Add new field
      role      # Add new field
      createdAt # Add new field
    }
  }
`;
```

### Update Fetch Function

```typescript
// src/contexts/AuthContext.tsx
const userData: User = {
  id: data.user.id,
  email: data.user.email,
  name: data.user.name,
  avatar: data.user.avatar,
  role: data.user.role,
  createdAt: data.user.createdAt,
};
```

## Performance Considerations

- **Network Only**: User query uses `fetchPolicy: "network-only"` to always fetch fresh data
- **Cached Tokens**: Tokens are read from localStorage (fast)
- **Loading State**: UI shows loading spinner during user data fetch
- **Error Recovery**: Failed fetches don't block the app indefinitely

## Testing

### Test 1: Login and Auto-Fetch

1. Clear localStorage
2. Login with valid credentials
3. ✅ Should fetch user data automatically
4. ✅ Should display user name and email

### Test 2: Refresh with Valid Token

1. Login successfully
2. Refresh the page
3. ✅ Should show loading spinner briefly
4. ✅ Should fetch and display user data

### Test 3: Expired Token

1. Login successfully
2. Manually expire the token (backend)
3. Refresh the page
4. ✅ Should clear tokens and redirect to login

### Test 4: Manual Refetch

1. Login successfully
2. Call `refetchUser()`
3. ✅ Should fetch latest user data from API
4. ✅ Should update user state and localStorage

## Troubleshooting

**Problem**: User data not fetched after login  
**Solution**: Check that USER_QUERY is returning data and network tab for errors

**Problem**: User data outdated after profile update  
**Solution**: Call `refetchUser()` after mutation

**Problem**: Infinite redirect loop  
**Solution**: Check that USER_QUERY doesn't return 401, verify token is valid

**Problem**: Loading spinner never disappears  
**Solution**: Check console for GraphQL errors, verify backend is responding

