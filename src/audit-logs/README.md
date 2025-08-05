# Audit Logs API Documentation

This module provides read-only access to audit logs that automatically track all CRUD operations across the system.

## Endpoints

### 1. Get All Audit Logs
**GET** `/audit-logs`

Retrieves all audit logs with user information, ordered by creation date (newest first).

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "entityType": "transaction",
      "entityId": 1,
      "action": "CREATE",
      "fieldChanged": null,
      "oldValue": null,
      "newValue": null,
      "description": "Created inflow transaction of 1000.50 for account Main Account",
      "createdBy": {
        "id": 1,
        "email": "admin@example.com",
        "accounts": [
          { "id": 1, "name": "Main Account" }
        ],
        "transactions": [
          { "id": 1, "type": "inflow", "amount": 1000.50 }
        ]
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "entityType": "transaction",
      "entityId": 1,
      "action": "UPDATE",
      "fieldChanged": "description",
      "oldValue": "Payment received from client",
      "newValue": "Updated payment description",
      "description": "Updated transaction description from Payment received from client to Updated payment description",
      "createdBy": {
        "id": 1,
        "email": "admin@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

### 2. Get Audit Log by ID
**GET** `/audit-logs/:id`

Retrieves a specific audit log by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "entityType": "transaction",
    "entityId": 1,
    "action": "CREATE",
    "fieldChanged": null,
    "oldValue": null,
    "newValue": null,
    "description": "Created inflow transaction of 1000.50 for account Main Account",
    "createdBy": {
      "id": 1,
      "email": "admin@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:**
- `404 Not Found`: Audit log not found

### 3. Get Audit Logs by Entity
**GET** `/audit-logs/entity/:entityType/:entityId`

Retrieves all audit logs for a specific entity (e.g., all logs for transaction ID 1).

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "entityType": "transaction",
      "entityId": 1,
      "action": "CREATE",
      "fieldChanged": null,
      "oldValue": null,
      "newValue": null,
      "description": "Created inflow transaction of 1000.50 for account Main Account",
      "createdBy": {
        "id": 1,
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "entityType": "transaction",
      "entityId": 1,
      "action": "UPDATE",
      "fieldChanged": "description",
      "oldValue": "Payment received from client",
      "newValue": "Updated payment description",
      "description": "Updated transaction description from Payment received from client to Updated payment description",
      "createdBy": {
        "id": 1,
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

### 4. Get Audit Logs by User
**GET** `/audit-logs/user/:userId`

Retrieves all audit logs created by a specific user.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "entityType": "transaction",
      "entityId": 1,
      "action": "CREATE",
      "fieldChanged": null,
      "oldValue": null,
      "newValue": null,
      "description": "Created inflow transaction of 1000.50 for account Main Account",
      "createdBy": {
        "id": 1,
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 3,
      "entityType": "account",
      "entityId": 2,
      "action": "CREATE",
      "fieldChanged": null,
      "oldValue": null,
      "newValue": null,
      "description": "Created account Secondary Account",
      "createdBy": {
        "id": 1,
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

## Audit Log Structure

### Fields Description

- **id**: Unique identifier for the audit log
- **entityType**: Type of entity being audited (e.g., "transaction", "account", "user", "bank", "currency", "category")
- **entityId**: ID of the specific entity being audited
- **action**: Type of action performed ("CREATE", "UPDATE", "DELETE")
- **fieldChanged**: For updates, the specific field that was changed (null for create/delete)
- **oldValue**: Previous value of the field (null for create/delete)
- **newValue**: New value of the field (null for create/delete)
- **description**: Human-readable description of the action
- **createdBy**: User who performed the action
- **createdAt**: Timestamp when the action was performed

### Action Types

1. **CREATE**: When a new entity is created
   - `fieldChanged`, `oldValue`, `newValue` are null
   - `description` contains information about what was created

2. **UPDATE**: When an existing entity is modified
   - `fieldChanged` contains the name of the modified field
   - `oldValue` contains the previous value
   - `newValue` contains the new value
   - `description` contains a summary of the change

3. **DELETE**: When an entity is deleted
   - `fieldChanged`, `oldValue`, `newValue` are null
   - `description` contains information about what was deleted

## Supported Entity Types

The audit system automatically tracks operations on these entities:

- **transaction**: Financial transactions
- **account**: Bank accounts
- **user**: System users
- **bank**: Banking institutions
- **currency**: Currency definitions
- **category**: Account categories

## Business Rules

1. **Immutability**: Audit logs cannot be modified or deleted once created
2. **Automatic Logging**: All POST, PUT, and PATCH requests are automatically logged
3. **User Tracking**: Every audit log includes the user who performed the action
4. **Field-Level Tracking**: Updates track individual field changes for detailed audit trails
5. **Comprehensive Coverage**: All CRUD operations across all modules are logged

## Error Handling

The API uses standard HTTP status codes:
- `200 OK`: Successful operation
- `404 Not Found`: Audit log or user not found
- `500 Internal Server Error`: Server error

## Use Cases

1. **Compliance**: Track all changes for regulatory compliance
2. **Debugging**: Identify who made what changes and when
3. **Security**: Monitor user activity and detect suspicious behavior
4. **Audit Trails**: Maintain complete history of all system changes
5. **Data Recovery**: Understand what data was changed and by whom 