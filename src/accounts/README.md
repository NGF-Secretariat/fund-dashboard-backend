# Accounts API

> **All account routes are protected by JWT authentication.**
>
> You must include a valid JWT token in the `Authorization: Bearer <token>` header for all requests to `/accounts` endpoints.

## Authentication & User Extraction

- Register or log in via `/auth/register` or `/auth/login` to obtain a JWT token.
- Include the token in the `Authorization` header for all requests:

```bash
curl -X GET http://localhost:3000/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- The authenticated user is extracted from the token and made available in controller methods via the `@CurrentUser()` decorator.

**Example Controller Usage:**

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Currency } from '../currencies/currencies.entity';
import { ManyToOne, JoinColumn, Column } from 'typeorm';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto, @CurrentUser() user: User) {
    // user.id is the authenticated user's ID from the token
    return this.accountsService.create(createAccountDto, user);
  }
}
```

---

This module handles account management with proper error handling, validation, and relationship management.

## Endpoints

### Create Account (POST /accounts)
Creates a new account with validation of all related entities.

**Request Body:**
```json
{
  "name": "Main Operating Account",
  "accountNumber": "1234567890",
  "bankId": 1,
  "currencyCode": "NGN",
  "categoryId": 1
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Main Operating Account",
    "accountNumber": "1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "bank": {
      "id": 1,
      "name": "GTBank",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "accounts": [
        { "id": 1, "name": "Main Operating Account" }
      ]
    },
    "currency": {
      "code": "NGN",
      "name": "Naira",
      "accounts": [
        { "id": 1, "name": "Main Operating Account" }
      ]
    },
    "category": {
      "id": 1,
      "name": "secretariat",
      "accounts": [
        { "id": 1, "name": "Main Operating Account" }
      ]
    },
    "createdBy": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "accounts": [
        { "id": 1, "name": "Main Operating Account" }
      ]
    },
    "transactions": []
  }
}
```

**Error Response (409 - Conflict):**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Account with this account number already exists",
  "error": "Conflict",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/accounts"
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
  "path": "/accounts"
}
```

### Get All Accounts (GET /accounts)
Retrieves all accounts with their related entities, ordered by creation date.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Savings Account",
      "accountNumber": "0987654321",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z",
      "bank": {
        "id": 2,
        "name": "Access Bank",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      },
      "currency": {
        "code": "USD",
        "name": "US Dollar"
      },
      "category": {
        "id": 2,
        "name": "project"
      },
      "createdBy": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2024-01-15T09:00:00.000Z"
      }
    },
    {
      "id": 1,
      "name": "Main Operating Account",
      "accountNumber": "1234567890",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "bank": {
        "id": 1,
        "name": "GTBank",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      },
      "currency": {
        "code": "NGN",
        "name": "Naira"
      },
      "category": {
        "id": 1,
        "name": "secretariat"
      },
      "createdBy": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2024-01-15T09:00:00.000Z"
      }
    }
  ]
}
```

### Get Account by ID (GET /accounts/:id)
Retrieves a specific account with all its related entities.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Main Operating Account",
    "accountNumber": "1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "bank": {
      "id": 1,
      "name": "GTBank",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    "currency": {
      "code": "NGN",
      "name": "Naira"
    },
    "category": {
      "id": 1,
      "name": "secretariat"
    },
    "createdBy": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  }
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Account with ID 999 not found",
  "error": "Not Found",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/accounts/999"
}
```

### Update Account (PATCH /accounts/:id)
Updates an account's information with validation of related entities.

**Request Body (Partial):**
```json
{
  "name": "Updated Account Name",
  "currencyCode": "USD"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Account Name",
    "accountNumber": "1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z",
    "bank": {
      "id": 1,
      "name": "GTBank",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    "currency": {
      "code": "USD",
      "name": "US Dollar"
    },
    "category": {
      "id": 1,
      "name": "secretariat"
    },
    "createdBy": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  }
}
```

### Delete Account (DELETE /accounts/:id)
Deletes an account.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Main Operating Account",
    "accountNumber": "1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "bank": {
      "id": 1,
      "name": "GTBank",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    "currency": {
      "code": "NGN",
      "name": "Naira"
    },
    "category": {
      "id": 1,
      "name": "secretariat"
    },
    "createdBy": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  }
}
```

## Validation Rules

### Create Account
- **name**: Required string, max 100 characters
- **accountNumber**: Required string, max 50 characters, must be unique
- **bankId**: Required number, must reference existing bank
- **currencyCode**: Required string, must reference existing currency (by code, e.g., "NGN")
- **categoryId**: Required number, must reference existing category
  
> **Note:** The `createdBy` field is always set automatically from the authenticated user (extracted from the JWT token). You do not need to send any user information in the request body.

### Update Account
- All fields are optional
- **accountNumber**: Must be unique if provided
- **bankId**: Must reference existing bank if provided
- **currencyCode**: Must reference existing currency (by code) if provided
- **categoryId**: Must reference existing category if provided
  
> **Note:** The `createdBy` field cannot be changed via update; it is always set from the authenticated user who created the account.

## Relationships

Accounts are linked to:
- **Bank**: The financial institution where the account is held
- **Currency**: The currency of the account
- **Category**: The account category (secretariat/project)
- **User**: The user who created the account

## Error Handling

The API uses proper HTTP status codes and structured error responses:

- **400**: Bad Request (validation errors)
- **404**: Not Found (account, bank, currency, category, or user not found)
- **409**: Conflict (duplicate account number)
- **500**: Internal Server Error (server errors)

All error responses follow the same structure with `success: false` and include error details.

## Data Integrity

- Account numbers are unique across the system
- All foreign key relationships are validated before creation/update
- Cascade operations are handled properly
- Timestamps are automatically managed 

## Bulk Upload (Excel)

To upload multiple accounts at once, use the `/accounts/upload` endpoint with an Excel file. The file must have the following columns (header row required):

| name                  | accountNumber | bankId | currencyCode | categoryId |
|-----------------------|--------------|--------|--------------|------------|
| Main Account          | 1234567890   | 1      | NGN          | 1          |
| Project Account       | 9876543210   | 2      | USD          | 2          |
| Secretariat Savings   | 1122334455   | 1      | EUR          | 1          |

**Excel Example:**

| name                | accountNumber | bankId | currencyCode | categoryId |
|---------------------|--------------|--------|--------------|------------|
| Main Account        | 1234567890   | 1      | NGN          | 1          |
| Project Account     | 9876543210   | 2      | USD          | 2          |
| Secretariat Savings | 1122334455   | 1      | EUR          | 1          |

- The first row must be the header.
- All columns are required and must match the field names exactly.
- Save as `.xlsx` or `.xls` before uploading. 