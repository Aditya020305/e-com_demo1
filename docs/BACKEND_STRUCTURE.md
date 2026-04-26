# 📄 BACKEND STRUCTURE DOCUMENT (BACKEND_STRUCTURE.md)
## 🛒 Multi-Vendor E-commerce Platform with Payment & AI Features

---

## 0. App Description

A multi-vendor e-commerce platform where sellers can list products and customers can browse, add to cart, and purchase products using a secure payment gateway.

Main features needing database support:
- User Authentication
- Product Management
- Cart System
- Orders & Payments
- Sessions

---

# 1. Architecture Overview

- Architecture Pattern: RESTful API (Layered: Routes → Controllers → Services → Models)
- Authentication Strategy: JWT (Access + Refresh tokens)
- Data Flow:
  Client → API → Controller → Service → Database → Response
- Caching: Redis (for products, sessions)

---

# 2. DATABASE SCHEMA

---

## users

| name        | type           | constraints                          | description |
|------------|----------------|--------------------------------------|-------------|
| id         | UUID           | PK, DEFAULT gen_random_uuid()        | user id |
| name       | VARCHAR(100)   | NOT NULL                             | user name |
| email      | VARCHAR(255)   | NOT NULL, UNIQUE                     | email |
| password   | VARCHAR(255)   | NOT NULL                             | hashed password |
| role       | VARCHAR(20)    | NOT NULL DEFAULT 'customer'          | role |
| created_at | TIMESTAMP      | NOT NULL DEFAULT CURRENT_TIMESTAMP   | created |
| updated_at | TIMESTAMP      | NOT NULL DEFAULT CURRENT_TIMESTAMP   | updated |

Indexes:
- PK(id)
- UNIQUE(email)

---

## sessions

| name        | type           | constraints                          | description |
|------------|----------------|--------------------------------------|-------------|
| id         | UUID           | PK                                   | session id |
| user_id    | UUID           | FK → users(id) ON DELETE CASCADE     | user |
| token      | VARCHAR(500)   | NOT NULL                             | refresh token |
| created_at | TIMESTAMP      | NOT NULL                             | created |
| updated_at | TIMESTAMP      | NOT NULL                             | updated |

---

## products

| name        | type           | constraints                          | description |
|------------|----------------|--------------------------------------|-------------|
| id         | UUID           | PK                                   | product id |
| seller_id  | UUID           | FK → users(id) ON DELETE CASCADE     | seller |
| name       | VARCHAR(255)   | NOT NULL                             | product name |
| price      | DECIMAL(10,2)  | NOT NULL                             | price |
| image_url  | VARCHAR(500)   | NOT NULL                             | image |
| created_at | TIMESTAMP      | NOT NULL                             | created |
| updated_at | TIMESTAMP      | NOT NULL                             | updated |

Indexes:
- seller_id

---

## carts

| name        | type           | constraints                          |
|------------|----------------|--------------------------------------|
| id         | UUID           | PK                                   |
| user_id    | UUID           | FK → users(id) ON DELETE CASCADE     |
| created_at | TIMESTAMP      | NOT NULL                             |
| updated_at | TIMESTAMP      | NOT NULL                             |

---

## cart_items

| name        | type           | constraints                          |
|------------|----------------|--------------------------------------|
| id         | UUID           | PK                                   |
| cart_id    | UUID           | FK → carts(id) ON DELETE CASCADE     |
| product_id | UUID           | FK → products(id)                    |
| quantity   | INT            | NOT NULL DEFAULT 1                   |
| created_at | TIMESTAMP      | NOT NULL                             |
| updated_at | TIMESTAMP      | NOT NULL                             |

---

## orders

| name        | type           | constraints                          |
|------------|----------------|--------------------------------------|
| id         | UUID           | PK                                   |
| user_id    | UUID           | FK → users(id)                       |
| total      | DECIMAL(10,2)  | NOT NULL                             |
| status     | VARCHAR(50)    | NOT NULL DEFAULT 'pending'           |
| created_at | TIMESTAMP      | NOT NULL                             |
| updated_at | TIMESTAMP      | NOT NULL                             |

---

## order_items

| name        | type           | constraints                          |
|------------|----------------|--------------------------------------|
| id         | UUID           | PK                                   |
| order_id   | UUID           | FK → orders(id) ON DELETE CASCADE    |
| product_id | UUID           | FK → products(id)                    |
| quantity   | INT            | NOT NULL                             |
| price      | DECIMAL(10,2)  | NOT NULL                             |
| created_at | TIMESTAMP      | NOT NULL                             |
| updated_at | TIMESTAMP      | NOT NULL                             |

---

# 3. API ENDPOINTS

---

## AUTH

### POST /api/auth/register

Request:
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}

Validation:

email must be valid
password min 6 chars

Response:

{
  "message": "User registered"
}

Errors:

400 invalid input
409 email exists
POST /api/auth/login

Response:

{
  "accessToken": "jwt",
  "refreshToken": "jwt"
}

Errors:

401 invalid credentials
POST /api/auth/logout
Auth required
Deletes session
PRODUCTS
GET /api/products

Response:

[
  {
    "id": "uuid",
    "name": "Product",
    "price": 100
  }
]
POST /api/products
Auth: seller

Request:

{
  "name": "Product",
  "price": 100
}

Errors:

400 validation error
403 unauthorized
CART
POST /api/cart/add
{
  "productId": "uuid",
  "quantity": 1
}
ORDERS
POST /api/orders
Creates order after payment
4. AUTHENTICATION

JWT Payload:

{
  "userId": "uuid",
  "role": "customer"
}
Access Token Expiry: 15 minutes
Refresh Token Expiry: 7 days
bcrypt rounds: 10

Roles:

customer → buy
seller → add products
admin → manage
5. ERROR RESPONSE FORMAT
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid email"
  }
}
6. CACHING STRATEGY
Cache products list
TTL: 300 seconds
Key: products:all
Invalidate on product create/update/delete
7. RATE LIMITING
Auth: 5 requests/min
General: 100 requests/15 min
8. MIGRATION STRATEGY
Tool: Mongoose / Mongo migrations
Process:
Create migration file
Run manually
Rollback supported via versioning