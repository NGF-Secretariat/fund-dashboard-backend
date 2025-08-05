# Authentication System

This module provides JWT-based authentication for the fund dashboard application, enabling secure user tracking for audit logging.

## How User Tracking Works

### 1. **Authentication Flow**

1. **User Registration/Login**: Users register or login through `/auth/register` or `/auth/login`
2. **JWT Token Generation**: The system generates a JWT token containing user information
3. **Token Storage**: The client stores the JWT token (typically in localStorage or cookies)
4. **Token Transmission**: The client includes the token in the `Authorization` header for subsequent requests
5. **Token Validation**: The JWT strategy validates the token and extracts user information
6. **User Population**: The validated user is attached to `request.user`
7. **Audit Logging**: The audit interceptor captures the user from `request.user` for logging

### 2. **JWT Token Structure**

```json
{
  "email": "user@example.com",
  "sub": 123,
  "iat": 1640995200,
  "exp": 1641081600
}
```

### 3. **Request Flow with Authentication**

```
Client Request → JWT Auth Guard → JWT Strategy → User Population → Controller → Audit Interceptor
     ↓              ↓                ↓              ↓              ↓              ↓
  Bearer Token → Token Validation → User Lookup → request.user → @CurrentUser() → Audit Log
```

### 4. **Protected Routes**

All routes that require user tracking are protected with `@UseGuards(JwtAuthGuard)`:

```typescript
@Controller('transactions')
@UseGuards(JwtAuthGuard)  // This ensures authentication
export class TransactionsController {
  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: User,  // This gets the authenticated user
  ) {
    return this.transactionsService.create(createTransactionDto, user);
  }
}
```

## API Endpoints

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### POST `/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

## Client Usage

### 1. **Login and Store Token**

```javascript
// Login
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { access_token } = await response.json();

// Store token
localStorage.setItem('token', access_token);
```

### 2. **Include Token in Requests**

```javascript
// Make authenticated requests
const response = await fetch('/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(transactionData)
});
```

## Security Features

### 1. **Password Hashing**
- Passwords are hashed using bcrypt with salt rounds of 10
- Original passwords are never stored in the database

### 2. **JWT Token Security**
- Tokens expire after 24 hours
- Tokens are signed with a secret key
- User information is validated on each request

### 3. **Route Protection**
- Protected routes require valid JWT tokens
- Unauthorized requests return 401 status

### 4. **User Validation**
- JWT strategy validates user existence on each request
- Invalid or expired tokens are rejected

## Environment Variables

Set the following environment variable for production:

```bash
JWT_SECRET=your-super-secure-secret-key-here
```

## Audit Logging Integration

The authentication system integrates seamlessly with the audit logging system:

1. **Automatic User Tracking**: The `@CurrentUser()` decorator automatically extracts the authenticated user
2. **Audit Interceptor**: Captures user information for all POST, PUT, PATCH, and DELETE operations
3. **Comprehensive Logging**: All user actions are logged with user ID, timestamp, and action details

### Example Audit Log Entry

```json
{
  "id": 1,
  "userId": 123,
  "userEmail": "john@example.com",
  "action": "CREATE",
  "entityType": "Transaction",
  "entityId": 456,
  "oldValues": null,
  "newValues": {
    "amount": 1000,
    "description": "Payment received"
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-01-01T12:00:00Z"
}
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if the JWT token is valid and not expired
2. **Token Missing**: Ensure the `Authorization` header is included with `Bearer` prefix
3. **User Not Found**: The user may have been deleted from the database

### Debug Steps

1. Verify token format: `Authorization: Bearer <token>`
2. Check token expiration
3. Validate user exists in database
4. Ensure JWT_SECRET is properly set

## User Roles

The system supports three user roles:

- **user**: Regular user with basic permissions
- **acct**: Account manager with extended permissions
- **audit**: Auditor with read-only access to audit logs

Role-based access control can be implemented by extending the JWT strategy and guards. 