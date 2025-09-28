# Frontend Authentication Integration

This document explains the authentication integration between the React frontend and the Spring Boot backend.

## Backend API Analysis

The backend provides the following authentication endpoints:

### Authentication Endpoints

1. **POST `/auth/register`**
   - **Purpose**: Register a new user
   - **Request Body**:
     ```json
     {
       "email": "user@example.com",
       "firstname": "John",
       "lastname": "Doe", 
       "phone": "+1234567890", // Optional
       "password": "password123"
     }
     ```
   - **Response**: JWT token in ApiResponse wrapper
   ```json
   {
     "data": "jwt-token-here",
     "success": true,
     "message": "Inscription réussie",
     "timestamp": "2024-01-01T00:00:00Z"
   }
   ```

2. **POST `/auth/login`**
   - **Purpose**: Authenticate existing user
   - **Request Body**:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - **Response**: JWT token in ApiResponse wrapper
   ```json
   {
     "data": "jwt-token-here",
     "success": true,
     "message": "Connexion réussie",
     "timestamp": "2024-01-01T00:00:00Z"
   }
   ```

## Frontend Implementation

### 1. API Layer (`src/api/`)

- **`auth.ts`**: Authentication API calls
- **`tokenService.ts`**: JWT token management (localStorage)
- **`apiClient.ts`**: Generic API client with auto-authentication

### 2. Context (`src/context/`)

- **`AuthContext.tsx`**: Global authentication state management
  - Provides: `isAuthenticated`, `token`, `login()`, `logout()`, `user`
  - Auto-checks token validity on app start

### 3. Components

- **`login-form.tsx`**: Updated with API integration
  - Form validation
  - Error handling
  - Redirect after login
- **`ProtectedRoute.tsx`**: Wrapper for authenticated routes
- **`Header.tsx`**: Shows user status and logout option

### 4. Pages

- **`Signup.tsx`**: Registration form with API integration
  - Password confirmation validation
  - All required fields connected to backend DTO

## Setup Instructions

### Backend Setup

1. Make sure the Spring Boot backend is running on `http://localhost:8080`
2. The application should have the dev profile active (uses PostgreSQL)
3. Ensure CORS is configured to allow requests from `http://localhost:5173`

### Frontend Setup

1. **Install dependencies** (if not already done):
   ```bash
   cd my-app
   npm install
   ```

2. **Environment Configuration**:
   The `.env` file is already configured with:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Usage

### Authentication Flow

1. **Registration**: 
   - Navigate to `/Signup`
   - Fill in all required fields (email, firstname, lastname, password)
   - Phone is optional
   - Password confirmation is validated on frontend
   - On success, user is automatically logged in and redirected to home

2. **Login**:
   - Navigate to `/Auth`
   - Enter email and password
   - On success, user is redirected to intended page (or home)

3. **Logout**:
   - Click logout icon in header (when authenticated)
   - Token is removed from localStorage
   - User is redirected appropriately

### Protected Routes

To protect a route, wrap it with `ProtectedRoute`:

```tsx
import { ProtectedRoute } from '@/Components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Using Authentication in Components

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      Welcome {user?.sub}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import { apiClient } from '@/api/apiClient';

// GET request with auto-authentication
const data = await apiClient.get('/api/protected/endpoint');

// POST request with auto-authentication  
const result = await apiClient.post('/api/protected/endpoint', { data: 'value' });
```

## Security Features

1. **JWT Token Storage**: Tokens are stored in localStorage
2. **Token Validation**: Automatic expiry checking
3. **Auto-Logout**: Expired tokens trigger automatic logout
4. **Request Interceptor**: Automatic token attachment to requests
5. **Error Handling**: 401 responses trigger re-authentication

## Error Handling

The authentication system handles various error scenarios:

- **Network errors**: User-friendly error messages
- **Invalid credentials**: Clear error display
- **Token expiry**: Automatic logout and redirect
- **Server errors**: Graceful error handling

## Development Notes

- Backend CORS must allow frontend origin
- JWT tokens contain user information in the payload
- Token expiry is checked before each request
- All authentication state is reactive across the app
- Form validation matches backend DTO requirements

## Testing the Integration

1. Start both backend and frontend servers
2. Try registering a new user at `/Signup`
3. Try logging in with the created credentials at `/Auth`
4. Verify the header shows user status when authenticated
5. Test logout functionality
6. Try accessing protected routes (if any are implemented)

The integration is now complete and ready for use!