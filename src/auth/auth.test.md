# Authentication System Test Guide

This guide demonstrates how the authentication system works with user tracking for audit logging.

## Prerequisites

1. Start the application: `npm run start:dev`
2. Ensure the database is running and migrations are applied

## Test Steps

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  }
}
```

### 2. Login with Existing User

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  }
}
```

### 3. Create a Transaction (Authenticated)

```bash
# Replace YOUR_TOKEN with the access_token from step 2
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 1000.50,
    "description": "Test transaction",
    "accountId": 1,
    "type": "credit"
  }'
```

**Expected Response:**
```json
{
  "data": {
    "id": 1,
    "amount": 1000.50,
    "description": "Test transaction",
    "accountId": 1,
    "type": "credit",
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  },
  "message": "Transaction created successfully"
}
```

### 4. Verify Audit Log Entry

```bash
curl -X GET http://localhost:3000/audit-logs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "userEmail": "test@example.com",
      "action": "CREATE",
      "entityType": "Transaction",
      "entityId": 1,
      "fieldChanged": null,
      "oldValue": null,
      "newValue": null,
      "description": "Created transaction with ID 1",
      "ipAddress": "127.0.0.1",
      "userAgent": "curl/7.68.0",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "message": "Audit logs retrieved successfully"
}
```

### 5. Test Unauthenticated Access

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000.50,
    "description": "Test transaction",
    "accountId": 1,
    "type": "credit"
  }'
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## How User Tracking Works

### 1. **Token Validation**
When a request is made with a JWT token:
1. The `JwtAuthGuard` intercepts the request
2. The `JwtStrategy` validates the token
3. User information is extracted from the token
4. The user is attached to `request.user`

### 2. **User Extraction**
The `@CurrentUser()` decorator extracts the user from `request.user`:

```typescript
@Post()
async create(
  @Body() createTransactionDto: CreateTransactionDto,
  @CurrentUser() user: User,  // Gets user from request.user
) {
  return this.transactionsService.create(createTransactionDto, user);
}
```

### 3. **Audit Logging**
The audit interceptor automatically logs user actions:

```typescript
// In audit interceptor
const user = request.user;  // Gets authenticated user
await this.auditService.logCreate(entityType, entityId, description, user);
```

## Key Points

1. **Authentication Required**: All protected routes require a valid JWT token
2. **User Tracking**: Every action is logged with the user who performed it
3. **Token Expiration**: Tokens expire after 24 hours
4. **Secure Storage**: Passwords are hashed using bcrypt
5. **Audit Trail**: Complete audit trail with user identification

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if token is valid and not expired
2. **Token Format**: Ensure `Authorization: Bearer <token>` format
3. **User Not Found**: Verify user exists in database
4. **Password Issues**: Check password hashing and comparison

### Debug Commands

```bash
# Check token validity (decode without verification)
echo "YOUR_TOKEN" | cut -d'.' -f2 | base64 -d

# Check user in database
# Use your database client to query the users table
```

This authentication system ensures that every action in the application is properly tracked with the user who performed it, providing a complete audit trail for compliance and security purposes. 