# Currencies API

This module handles currency management with proper error handling and validation.

## Endpoints

### Create Currency (POST /currencies)
Creates a new currency with validation.

**Request Body:**
```json
{
  "code": "NGN",
  "name": "Naira"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "NGN",
    "name": "Naira",
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
  "message": "Currency with this code already exists",
  "error": "Conflict",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/currencies"
}
```

**Error Response (400 - Bad Request):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": [
    "Currency code must be exactly 3 uppercase letters"
  ],
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/currencies"
}
```

### Get All Currencies (GET /currencies)
Retrieves all currencies ordered by code.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "code": "EUR",
      "name": "Euro",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 1,
      "code": "NGN",
      "name": "Naira",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 3,
      "code": "USD",
      "name": "US Dollar",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### Get Currency by ID (GET /currencies/:id)
Retrieves a specific currency by its ID.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "NGN",
    "name": "Naira",
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
  "message": "Currency with ID 999 not found",
  "error": "Not Found",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/currencies/999"
}
```

### Update Currency (PATCH /currencies/:id)
Updates a currency's information.

**Request Body (Partial):**
```json
{
  "name": "Nigerian Naira"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "NGN",
    "name": "Nigerian Naira",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error Response (409 - Conflict):**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Currency with this name already exists",
  "error": "Conflict",
  "timestamp": "2024-01-15T10:35:00.000Z",
  "path": "/currencies/1"
}
```

### Delete Currency (DELETE /currencies/:id)
Deletes a currency.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "NGN",
    "name": "Nigerian Naira",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

## Validation Rules

### Create Currency
- **code**: Required string, exactly 3 uppercase letters (e.g., "USD", "EUR", "NGN")
- **name**: Required string, 1-50 characters, must be unique

### Update Currency
- **id**: Cannot be updated (primary key)
- **code**: Cannot be updated (unique constraint)
- **name**: Optional string, 1-50 characters, must be unique if provided

## Common Currency Codes

Here are some common ISO 4217 currency codes:

| Code | Name |
|------|------|
| USD | US Dollar |
| EUR | Euro |
| GBP | British Pound |
| JPY | Japanese Yen |
| CAD | Canadian Dollar |
| AUD | Australian Dollar |
| CHF | Swiss Franc |
| CNY | Chinese Yuan |
| INR | Indian Rupee |
| NGN | Nigerian Naira |
| ZAR | South African Rand |
| BRL | Brazilian Real |
| MXN | Mexican Peso |
| RUB | Russian Ruble |
| KRW | South Korean Won |

## Error Handling

The API uses proper HTTP status codes and structured error responses:

- **400**: Bad Request (validation errors)
- **404**: Not Found (currency not found)
- **409**: Conflict (duplicate currency code or name)
- **500**: Internal Server Error (server errors)

All error responses follow the same structure with `success: false` and include error details.

## Data Integrity

- Currency codes are unique and follow ISO 4217 standard (3 uppercase letters)
- Currency names are unique across the system
- Primary key is auto-generated ID (cannot be updated)
- Currency codes cannot be updated (unique constraint)
- Timestamps are automatically managed
- Proper validation ensures data consistency

## Usage Examples

### Creating Multiple Currencies
```bash
# Create USD
curl -X POST http://localhost:3000/currencies \
  -H "Content-Type: application/json" \
  -d '{"code": "USD", "name": "US Dollar"}'

# Create EUR
curl -X POST http://localhost:3000/currencies \
  -H "Content-Type: application/json" \
  -d '{"code": "EUR", "name": "Euro"}'

# Create NGN
curl -X POST http://localhost:3000/currencies \
  -H "Content-Type: application/json" \
  -d '{"code": "NGN", "name": "Nigerian Naira"}'
```

### Updating Currency Name
```bash
curl -X PATCH http://localhost:3000/currencies/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Nigerian Naira"}'
```

### Getting All Currencies
```bash
curl -X GET http://localhost:3000/currencies
``` 