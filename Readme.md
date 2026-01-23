# Order Management System

Node.js/Express app for handling product orders with stock management and concurrency control.

## Tech Stack
- Node.js + Express
- MySQL
- mysql2, cors

## Folder Structure
```
├── config/
│   └── db.js                    # database connection pool
├── models/
│   ├── Order.js                 # order entity
│   └── Product.js               # product entity
├── repositories/
│   ├── OrderRepository.js       # order database operations
│   └── ProductRepository.js     # product database operations
├── services/
│   └── orderService.js          # business logic
├── controller/
│   └── ordercontroller.js       # request/response handling
├── routes/
│   └── route.js                 # api routes
├── index.js                     # entry point
└── server.js                    # express config
```

## API Flow

POST /order
```
Request: { "productId": 1, "quantity": 5 }

Client → Route → Controller → Service → Repository → Database

1. Controller validates request
2. Service starts transaction
3. ProductRepository locks row (SELECT FOR UPDATE)
4. Validate stock availability
5. Update product stock
6. Create order record
6. Commit or rollback transaction
7. Return response

Success: { "message": "Order created", "order": {...} }
Error: { "message": "Insufficient stock. Only X units available." }
```

## Concurrency Handling

Uses pessimistic locking to prevent race conditions when multiple users order same product.

Problem without locking:
```
Time | User A            | User B
-----|-------------------|------------------
T1   | Read stock: 10    |
T2   |                   | Read stock: 10
T3   | Order 8 units     |
T4   |                   | Order 7 units
T5   | Update stock: 2   |
T6   |                   | Update stock: 3
```
Result: Both orders succeed, stock inconsistent

Solution - Row locking with transactions:
```
// orderService.js
const connection = await db.getConnection();
await connection.beginTransaction();

// locks product row until transaction ends
const product = await ProductRepository.findByIdForUpdate(productId, connection);

if (product.stock < quantity) {
  throw new Error("Insufficient stock");
}

await ProductRepository.updateStock(productId, newStock, connection);
await OrderRepository.createOrder(productId, quantity, connection);

await connection.commit();
connection.release();
```

How it works:
- SELECT FOR UPDATE locks the row
- Other transactions wait for lock release
- Only one transaction modifies stock at a time
- Rollback on errors keeps data consistent

## Setup

1. Install dependencies
```
npm install
```

2. Configure database in config/db.js

3. Start server
```
npm start
```
Server runs on http://localhost:3000