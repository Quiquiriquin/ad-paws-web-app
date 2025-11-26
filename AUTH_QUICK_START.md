# Authentication System - Quick Start

## What Was Implemented

A complete authentication system has been added to your application with:

✅ **Token-based authentication** using JWT access and refresh tokens  
✅ **Protected routes** that automatically redirect to login  
✅ **Public routes** that redirect authenticated users away from auth pages  
✅ **Persistent sessions** using localStorage  
✅ **Apollo Client integration** with automatic token injection  
✅ **Loading states** during auth initialization  
✅ **Post-login redirect** to the originally requested page  

## Files Created/Modified

### New Files
- `src/contexts/AuthContext.tsx` - Main authentication context and provider
- `src/lib/auth.ts` - Helper functions for token management
- `src/components/ProtectedRoute.tsx` - Wrapper for protected routes
- `src/components/PublicRoute.tsx` - Wrapper for public/auth routes
- `src/contexts/README.md` - Complete documentation

### Modified Files
- `src/main.tsx` - Added AuthProvider wrapper
- `src/routes.tsx` - Added ProtectedRoute and PublicRoute wrappers (renamed from .ts to .tsx)
- `src/pages/authentication/login.tsx` - Integrated with auth context
- `src/App.tsx` - Added logout button demo
- `src/lib/api/apolloClient.ts` - Added automatic token injection in headers

## How It Works

### 1. User visits protected route (e.g., `/`)

```
Not authenticated → Redirect to /auth/login
Already authenticated → Show the page
```

### 2. User logs in at `/auth/login`

```typescript
// Login page calls the mutation
signInUser({ variables: { input: formData } })

// On success, save tokens
login({
  accessToken: data.signUser.accessToken,
  refreshToken: data.signUser.refreshToken,
})

// Automatically redirects to intended destination
```

### 3. All API requests include the token

```typescript
// Apollo Client automatically adds:
headers: {
  authorization: "Bearer <access_token>"
}
```

### 4. User logs out

```typescript
// Clear all auth data
logout()

// Automatically redirected to /auth/login
```

## Quick Usage

### Check if user is logged in

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user?.email}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Logout button

```tsx
import { useAuth } from "@/contexts/AuthContext";

function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <button onClick={logout}>
      Cerrar sesión
    </button>
  );
}
```

### Protect a new route

```tsx
// In routes.tsx
{
  path: "/dashboard",
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
}
```

## Testing the Flow

### Test 1: Access protected route without login
1. Clear localStorage (Dev Tools → Application → Local Storage → Clear All)
2. Go to `http://localhost:5173/`
3. ✅ Should redirect to `/auth/login`

### Test 2: Login successfully
1. Go to `/auth/login`
2. Enter valid credentials
3. ✅ Should redirect to `/` (or originally requested page)
4. ✅ Should see logout button with email

### Test 3: Already logged in, visit login page
1. With active session, go to `/auth/login`
2. ✅ Should redirect to `/` automatically

### Test 4: Logout
1. Click logout button on home page
2. ✅ Should redirect to `/auth/login`
3. ✅ Attempting to visit `/` should redirect to login

### Test 5: Persistent session
1. Login successfully
2. Refresh the page
3. ✅ Should remain logged in
4. Close and reopen browser
5. ✅ Should still be logged in

## Token Storage (localStorage)

The following keys are used:
- `accessToken` - JWT access token for API requests
- `refreshToken` - JWT refresh token for token renewal
- `userData` - JSON stringified user information

## Security Notes

⚠️ **Current Implementation:**
- Tokens stored in localStorage (vulnerable to XSS)
- No automatic token refresh
- No token expiration checking

🔒 **For Production, Consider:**
- Implementing token refresh logic
- Adding token expiration checks
- Using httpOnly cookies instead of localStorage
- Implementing CSRF protection
- Adding rate limiting on login attempts

## Next Steps

1. **Implement Token Refresh**: Add logic to refresh expired access tokens
2. **Add User Profile**: Create endpoint and UI for user profile
3. **Role-Based Access**: Add role checking for different permission levels
4. **Remember Me**: Add option to persist session longer
5. **Two-Factor Auth**: Implement 2FA for enhanced security

## Troubleshooting

**Problem:** Users aren't redirected after login  
**Solution:** Check that the LOGIN_MUTATION returns `accessToken` and `refreshToken`

**Problem:** API requests fail with 401  
**Solution:** Verify tokens are being sent in headers (check Network tab in DevTools)

**Problem:** Users logged out unexpectedly  
**Solution:** Check if tokens expired or were cleared. Implement token refresh.

**Problem:** Loading spinner never goes away  
**Solution:** Check console for errors in AuthContext initialization

## Support

For detailed documentation, see:
- `src/contexts/README.md` - Complete auth system documentation
- `src/components/Form/README.md` - Form component documentation

## Demo Credentials

Check with your backend team for test credentials or create a test user through your API.

