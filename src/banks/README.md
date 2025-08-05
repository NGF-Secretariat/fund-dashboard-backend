# Banks API

This module handles bank management with proper error handling and validation.

## Endpoints

### Create Bank (POST /banks)
Creates a new bank with validation.

**Request Body:**
```json
{
  "name": "GTBank"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "GTBank",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "accounts": [
      { "id": 1, "name": "Main Operating Account" }
    ]
  }
}
```

**Error Response (409 - Conflict):**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Bank with this name already exists",
  "error": "Conflict",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/banks"
}
```

### Get All Banks (GET /banks)
Retrieves all banks ordered by name.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Access Bank",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 1,
      "name": "GTBank",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 3,
      "name": "UBA",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get Bank by ID (GET /banks/:id)
Retrieves a specific bank by ID.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "GTBank",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Bank with ID 999 not found",
  "error": "Not Found",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/banks/999"
}
```

### Update Bank (PATCH /banks/:id)
Updates a bank's information.

**Request Body:**
```json
{
  "name": "GTBank Plc"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "GTBank Plc",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### Delete Bank (DELETE /banks/:id)
Deletes a bank.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "GTBank Plc",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

## Validation Rules

- **name**: Required string, 2-100 characters, must be unique
- **id**: Must be a valid integer for update/delete operations

## Error Handling

The API uses proper HTTP status codes and structured error responses:

- **400**: Bad Request (validation errors)
- **404**: Not Found (bank not found)
- **409**: Conflict (duplicate bank name)
- **500**: Internal Server Error (server errors)

All error responses follow the same structure with `success: false` and include error details. 