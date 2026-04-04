# Misk E-Commerce API

Misk is a robust backend REST API built for an e-commerce platform. It provides a highly modular architecture focused on scalability, data integrity, and excellent payment flow handling. This backend powers everything from product catalogs and dynamic shopping carts to complex order transitions, safe inventory management, and secure Paymob payment gateways.

## 🏗️ Architecture Design

The project is built around the **Domain-Driven Module Architecture**. Instead of having all controllers in one folder and all models in another across the entire app, features are isolated into their respective domains inside `src/modules`. 

### Stack
- **Node.js** & **Express.js** 
- **TypeScript** (Strongly typed payloads, strictly defined document models)
- **MongoDB** & **Mongoose ODM** (NoSQL schema validation, populate tracking)
- **Multer** (Memory storage image handling)
- **Zod** (Data schema validation inside Mongoose models)
- **Node-Cron** (Scheduled recurring daemon jobs)
- **Paymob** (Egypt's localized Payment Gateway Provider)

### System Workflows
- **Validation**: Handled inherently at the Mongoose level + Zod schemas for complex string validations (like Emails).
- **Global Error Handling**: Uncaught async exceptions are wrapped by `catchAsync`. They trickle down to `error.middleware.ts`, which maps Mongoose validation errors, Mongo connection errors, and AppErrors to a standardized JSON response matching the environment logic (`dev` vs `production`).
- **Authorization**: Extracted from cookies or headers, JWT is verified. `passwordChangedAt` timestamps check if a user reset their credentials *after* the JWT issue date to automatically kill stale sessions.

---

## 🗂️ File System (FS) Overview

```text
src/
├── app.ts                 # Express initialization, global middlewares, 404/Error fallbacks, Cron jobs
├── index.ts               # Server entry point, DB loader, health checks (e.g. GET /)
├── database/              
│   ├── models/            # Mongoose models defining exact DB schemas (Orders, Variants, Products, etc.)
│   └── migrations/        # Seeding and schema migrations
├── routers/               
│   └── index.ts           # Central API Router registry (Aggregates all module routes to /api/v1/*)
├── utilities/             
│   ├── middlware/         # Generic middleware (Auth requirements, Admin roles, Error catchers)
│   └── utilis/            # Cross-domain helpers (Hash functions, JWT issues, Mailers, Multer, Paymob SDK logic)
└── modules/               # The Core business logic, split by feature:
    ├── auth/              # Registration, login, activation, forget/reset password flows
    ├── users/             # Admin management of User accounts
    ├── products/          # Main catalog details (Titles, desc, images)
    ├── variants/          # Physical SKUs of products (Size, Price, Stock per variant)
    ├── categories/        # Grouping classifications
    ├── brands/            # Manufacturer entities
    ├── reviews/           # Product scoring
    ├── cart/              # User shopping contexts
    ├── cart-items/        # Individual elements within a users Cart (tied to Variants)
    ├── orders/            # Order generation and lifecycle machines
    ├── orderItems/        # Snapshot prices and locked quantities for a confirmed order
    ├── payments/          # Internal representation of Paymob intentions and webhook listeners
    └── cities/            # Shipment localization routing
```
*Each feature folder in `modules/` typically contains its own `*.controller.ts`, `*.service.ts`, `*.router.ts`, and `*.types.ts` making it highly portable.*

---

## ✨ Features & Modules Deep Dive

### 1. Authentication & Users (`auth`, `users`)
- Secures endpoints using stateless **JWTs**.
- Native implementations of password hashing (Bcrypt).
- Fully supports user addresses arrays with validation.
- Distinct routes for users (`/api/v1/auth/me`) vs admins managing users (`/api/v1/admin/users`).
- Support for activating and deactivating accounts without hard-deleting records.

### 2. Catalog Topology (`categories`, `brands`, `products`, `variants`, `reviews`)
Misk separates products from their purchasable variants.
- **Categories & Brands**: Act as taxonomies to filter queries.
- **Products**: Represent the umbrella item (e.g., "Vanilla Perfume"). Holds localizations (En/Ar), descriptions, and image galleries.
- **Variants**: Represent the specific item a user buys (e.g., "50ml Bottle"). Holds the **Price** and exact **Stock**.
- **Reviews**: Linked directly to the product. Ratings can be dynamically fetched.
- **Multer Uploads**: Images are uploaded in-memory, expected to be passed downstream to a CDN provider (like AWS S3 or Supabase).

### 3. Shopping Cart (`cart`, `cart-items`)
- Persistent carts assigned 1:1 per user account.
- Handled safely where multiple endpoints let users tweak their CartItems dynamically (updating quantities, tracking subtotals).
- Cart carries a **CartHash** to monitor if user changes their cart items *during* a failed checkout, preventing double-billing on older item arrays.

### 4. Advanced Order Lifecycle (`orders`, `orderItems`)
The order module prevents race-conditions and guarantees stock safety.
- **Checkout Initialization**: 
  1. Checks if all items are natively in stock.
  2. Aggregates pricing directly from DB Variants (prevents tampering with client-side pricing).
  3. Pre-generates the `Order` and strictly isolates `OrderItems`.
- **Atomic Stock Deduction**: Converts available stock inside Inventory into `reservedStock` inside `OrderItem` to safely hold it while user is entering credit card details.
- **State Machine Transitions**: Transitions between `PENDING` ➔ `PAID` ➔ `SHIPPED` ➔ `DELIVERED` or `CANCELED`. Validates transitions so a `DELIVERED` order can never be mapped to `CANCELED`.

### 5. Payment Gateway Configuration (`payments`)
Fully integrated with **Paymob** for MEA-ready payment processing.
- Automatically bundles the Order details (Prices, customer billing info logic) into Paymob `Intentions` or `Payment Keys`.
- Stores the returned internal Gate Order ID and Transaction IDs.
- **Secure Webhooks**: Actively listens to `/api/v1/payments/webhook`.
- **HMAC-SHA512 verification** blocks spoofed requests from updating database ledgers.
- Safely processes "PAID" payloads by clearing `reservedStock` (solidifying the purchase). If a payment is voided/fails, invokes the stock recovery mechanism automatically.

### 6. Scheduled Housekeeping (Cron Tasks)
Stored globally in `app.ts`.
- **Stock Restorer Daemon**: Runs every 5 minutes (`*/5 * * * *`). Locates `PENDING` orders older than 15 minutes that never completed Paymob flow. It identifies stuck `reservedStock` inside `OrderItem` and injects it backward into `Variant` stocks automatically, ultimately keeping warehouse inventories permanently aligned.

---

## 🚀 Key Endpoints Map

### Public/User Interfaces
* `POST   /api/v1/auth/register` - Create an account
* `POST   /api/v1/auth/login` - Authenticate
* `GET    /api/v1/products` - Browse catalog (Paginated)
* `GET    /api/v1/cart` - View active cart contents
* `POST   /api/v1/cart-items` - Add Variant to cart
* `POST   /api/v1/orders` - Issue a checkout payload (starts payment flow)
* `GET    /api/v1/orders` - View my past transaction history
* `POST   /api/v1/payments/webhook` - Standard entry for Paymob callbacks

### Administrator Interfaces *(Requires JWT + `isAdmin=true`)*
* `GET    /api/v1/admin/users` - Fetch user network list
* `PATCH  /api/v1/orders/admin/:id/status` - Shift shipping states
* `POST   /api/v1/products` - Instantiate stock entities
* `GET    /api/v1/payments` - Audit global financial ledgers
* `POST   /api/v1/variants` - Adjust inventory stock numbers

---

## 🛠️ Environment Variables Configuration Requirements
To run Misk locally, an `.env` file should include the following core dependencies:

```env
NODE_ENV=development
PORT=3000
DB_STRING=mongodb+srv://<<USERNAME>>:<<PASSWORD>>@cluster...
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=complex_jwt_secret_here

# Paymob Specific
PAYMOB_PUBLIC_KEY=your_public_key
PAYMOB_INTEGRATION_ID=your_integration_id
PAYMOB_HMAC_SECRET=your_hmac_secret
API_URL=https://your-backend-api.com
CLIENT_URL=https://your-frontend-domain.com
```
