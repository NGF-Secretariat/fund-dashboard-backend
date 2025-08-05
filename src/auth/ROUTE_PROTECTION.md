# Route Protection Summary

This document outlines which routes are protected with JWT authentication and which are publicly accessible.

## Protected Routes (Require JWT Token)

All the following routes require a valid JWT token in the `Authorization: Bearer <token>` header:

### Authentication Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Banks Routes
- `GET /banks` - Get all banks
- `POST /banks` - Create new bank
- `GET /banks/:id` - Get bank by ID
- `PATCH /banks/:id` - Update bank
- `DELETE /banks/:id` - Delete bank

### Currencies Routes
- `GET /currencies` - Get all currencies
- `POST /currencies` - Create new currency
- `GET /currencies/:id` - Get currency by ID
- `PATCH /currencies/:id` - Update currency
- `DELETE /currencies/:id` - Delete currency

### Categories Routes
- `GET /categories` - Get all categories
- `POST /categories` - Create new category
- `GET /categories/:id` - Get category by ID
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Accounts Routes
- `GET /accounts` - Get all accounts
- `POST /accounts` - Create new account
- `GET /accounts/:id` - Get account by ID
- `PATCH /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account

### Transactions Routes
- `GET /transactions` - Get all transactions
- `POST /transactions` - Create new transaction
- `GET /transactions/:id` - Get transaction by ID
- `PATCH /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Audit Logs Routes
- `GET /audit-logs` - Get all audit logs
- `GET /audit-logs/:id` - Get audit log by ID
- `GET /audit-logs/entity/:entityType/:entityId` - Get audit logs by entity
- `GET /audit-logs/user/:userId` - Get audit logs by user

### Dashboard Routes
- `GET /dashboard/` - Get dashboard test result
- `GET /dashboard/:category/banks/:bankId/accounts` - Get accounts by bank and category

## Public Routes (No Authentication Required)

The following routes are publicly accessible and do not require authentication:

### App Routes
- `GET /` - Health check/hello endpoint

### User Management Routes
- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/login` - User login (legacy endpoint)

## Authentication Flow

### For Protected Routes:

1. **Include JWT Token:**
   ```bash
   curl -X GET http://localhost:3000/transactions \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **Expected Response (Authenticated):**
   ```json
   {
     "data": [...],
     "message": "Transactions retrieved successfully"
   }
   ```

3. **Expected Response (Unauthenticated):**
   ```json
   {
     "statusCode": 401,
     "message": "Unauthorized"
   }
   ```

### For Public Routes:

1. **No Token Required:**
   ```bash
   curl -X GET http://localhost:3000/
   ```

2. **Expected Response:**
   ```json
   "Hello World!"
   ```

## Security Considerations

### Protected Routes Benefits:
- **User Tracking**: All actions are logged with the authenticated user
- **Audit Trail**: Complete audit trail for compliance
- **Access Control**: Only authenticated users can access sensitive data
- **Data Integrity**: Prevents unauthorized modifications

### Public Routes Considerations:
- **User Management**: User routes are public to allow registration and login
- **Health Checks**: App routes are public for monitoring purposes
- **Legacy Support**: Some user endpoints remain public for backward compatibility

## Implementation Details

### JWT Auth Guard
The `JwtAuthGuard` is applied at the controller level:

```typescript
@Controller('transactions')
@UseGuards(JwtAuthGuard)  // Protects all routes in this controller
export class TransactionsController {
  // All methods require authentication
}
```

### Current User Decorator
Protected routes can access the authenticated user:

```typescript
@Post()
async create(
  @Body() createDto: CreateDto,
  @CurrentUser() user: User,  // Gets authenticated user
) {
  return this.service.create(createDto, user);
}
```

### Audit Logging
All protected routes automatically log user actions:

```typescript
// Automatically logged by audit interceptor
{
  "userId": 123,
  "userEmail": "user@example.com",
  "action": "CREATE",
  "entityType": "Transaction",
  "entityId": 456
}
```

## Testing Authentication

### Test Protected Route Access:
```bash
# Without token (should fail)
curl -X GET http://localhost:3000/transactions

# With token (should succeed)
curl -X GET http://localhost:3000/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Public Route Access:
```bash
# Should work without token
curl -X GET http://localhost:3000/
curl -X GET http://localhost:3000/users
```

This configuration ensures that all sensitive operations require authentication while keeping user management and health check endpoints publicly accessible. 