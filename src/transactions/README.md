# Transactions API Documentation

This module provides CRUD operations for financial transactions with automatic audit logging.

## Endpoints

### 1. Create Transaction
**POST** `/transactions`

Creates a new transaction and automatically updates the account balance.

**Request Body:**
```json
{
  "accountId": 1,
  "type": "inflow",
  "amount": 1000.50,
  "description": "Payment received from client"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "type": "inflow",
    "amount": 1000.50,
    "previousBalance": 500.00,
    "currentBalance": 1500.50,
    "description": "Payment received from client",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "account": {
      "id": 1,
      "name": "Main Account",
      "currency": {
        "code": "USD",
        "name": "US Dollar"
      },
      "transactions": [
        { "id": 1, "type": "inflow", "amount": 1000.50 }
      ]
    },
    "createdBy": {
      "id": 1,
      "email": "admin@example.com",
      "transactions": [
        { "id": 1, "type": "inflow", "amount": 1000.50 }
      ]
    }
  }
}
```

**Validation Rules:**
- `accountId`: Required, must be a valid account ID
- `type`: Required, must be either "inflow" or "outflow"
- `amount`: Required, must be positive number with minimum 0.01
- `description`: Optional string

**Error Responses:**
- `400 Bad Request`: Invalid data or insufficient balance for outflow
- `404 Not Found`: Account not found

### 2. Get All Transactions
**GET** `/transactions`

Retrieves all transactions with related data.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "inflow",
      "amount": 1000.50,
      "previousBalance": 500.00,
      "currentBalance": 1500.50,
      "description": "Payment received from client",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "account": {
        "id": 1,
        "name": "Main Account",
        "currency": {
          "code": "USD",
          "name": "US Dollar"
        }
      },
      "createdBy": {
        "id": 1,
        "email": "admin@example.com"
      }
    }
  ]
}
```

### 3. Get Transaction by ID
**GET** `/transactions/:id`

Retrieves a specific transaction by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "type": "inflow",
    "amount": 1000.50,
    "previousBalance": 500.00,
    "currentBalance": 1500.50,
    "description": "Payment received from client",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "account": {
      "id": 1,
      "name": "Main Account",
      "currency": {
        "code": "USD",
        "name": "US Dollar"
      }
    },
    "createdBy": {
      "id": 1,
      "email": "admin@example.com"
    }
  }
}
```

**Error Response:**
- `404 Not Found`: Transaction not found

### 4. Update Transaction
**PATCH** `/transactions/:id`

Updates an existing transaction. Only description can be updated for data integrity.

**Request Body:**
```json
{
  "description": "Updated payment description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "type": "inflow",
    "amount": 1000.50,
    "previousBalance": 500.00,
    "currentBalance": 1500.50,
    "description": "Updated payment description",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: Transaction not found

### 5. Delete Transaction
**DELETE** `/transactions/:id`

Deletes a transaction.

**Response (204 No Content):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

**Error Response:**
- `404 Not Found`: Transaction not found

## Audit Logging

All transactions are automatically logged in the audit system:

- **CREATE**: Logs when a new transaction is created
- **UPDATE**: Logs when a transaction is updated (field-level changes)
- **DELETE**: Logs when a transaction is deleted

### Audit Log Example
```json
{
  "id": 1,
  "entityType": "transaction",
  "entityId": 1,
  "action": "CREATE",
  "description": "Created inflow transaction of 1000.50 for account Main Account",
  "createdBy": {
    "id": 1,
    "email": "admin@example.com"
  },
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## Business Rules

1. **Balance Management**: 
   - Inflow transactions increase account balance
   - Outflow transactions decrease account balance
   - Insufficient balance prevents outflow transactions

2. **Data Integrity**:
   - Transaction amounts cannot be negative
   - Previous and current balance are automatically calculated
   - Account balance is updated atomically with transaction creation

3. **Audit Trail**:
   - All operations are logged with user information
   - Field-level changes are tracked for updates
   - Audit logs are immutable and cannot be deleted

## Error Handling

The API uses standard HTTP status codes:
- `200 OK`: Successful operation
- `201 Created`: Resource created successfully
- `204 No Content`: Resource deleted successfully
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error 