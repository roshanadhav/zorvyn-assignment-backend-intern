# Finance Data Processing & Access Control Backend

## Overview

This project is a backend system for a finance dashboard that manages financial records with role-based access control (RBAC) and provides aggregated analytics.

The system focuses on clean architecture, modular design, proper validation, and secure access control.

---

## Architecture & Folder Structure

```
BACKEND/
│
├── config/
│   ├── db.js
│   ├── email.config.js
│   ├── env.js
│   ├── nodemailer.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── error.middleware.js
│   ├── validator.middleware.js
│
├── modules/
│   ├── auth/
│   │   ├── authController.js
│   │   ├── authRouter.js
│   │
│   ├── dashboard/
│   │   ├── dashboard.controller.js
│   │   ├── dashboard.routes.js
│   │   ├── dashboard.service.js
│   │
│   ├── record/
│   │   ├── record.controller.js
│   │   ├── record.model.js
│   │   ├── record.routes.js
│   │   ├── record.service.js
│   │
│   ├── user/
│   │   ├── user.model.js
│   │   ├── user.routes.js
│   │   ├── user.service.js
│
├── utils/
│   ├── apiResponse.js
│   ├── asyncHandler.js
│
├── validators/
│   ├── record.validator.js
│   ├── user.validator.js
│
├── app.js
├── package.json
└── .env
```

---

## Role-Based Access Control (RBAC)

| Role     | Permissions |
|----------|------------|
| Viewer   | Access dashboard only |
| Analyst  | View records and dashboard |
| Admin    | Full access (CRUD + user management) |

### Enforcement
- Authentication middleware verifies JWT and attaches user
- Role middleware restricts access based on roles
- Records are scoped to the authenticated user

---

## API Endpoints

---

## /api/auth

### Register
**POST** `/api/auth/register`
```json
{
  "name": "Roshan",
  "email": "roshan@gmail.com",
  "password": "password123"
}
```

### Login
**POST** `/api/auth/login`
```json
{
  "email": "roshan@gmail.com",
  "password": "password123"
}
```

### Logout
**POST** `/api/auth/logout`

### Send Verification OTP
**POST** `/api/auth/send-verify-otp`
```json
{
  "email": "roshan@gmail.com"
}
```

### Verify Account
**POST** `/api/auth/verify-account`
```json
{
  "email": "roshan@gmail.com",
  "otp": "123456"
}
```

### Check Auth
**GET** `/api/auth/is-auth`

### Send Reset Password OTP
**POST** `/api/auth/reset-pass-otp-send`
```json
{
  "email": "roshan@gmail.com"
}
```

### Verify OTP & Change Password
**POST** `/api/auth/verify-otp-change-pass`
```json
{
  "email": "roshan@gmail.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

---

## /api/records

### Create Record
**POST** `/api/records/create`  
Access: Admin

```json
{
  "amount": 5000,
  "type": "expense",
  "category": "food",
  "date": "2026-04-04",
  "note": "Dinner"
}
```

---

### Get Records
**GET** `/api/records`  
Access: Admin, Analyst

Query Parameters:
- type
- category
- startDate
- endDate
- page
- limit

Example:
```
/api/records?type=expense&page=1&limit=10
```

---

### Update Record
**PATCH** `/api/records/:id`  
Access: Admin

```json
{
  "amount": 7000,
  "category": "travel"
}
```

---

### Delete Record (Soft Delete)
**DELETE** `/api/records/:id`  
Access: Admin

---

## /api/dashboard

### Summary
**GET** `/api/dashboard/summary`

Returns:
- totalIncome
- totalExpense
- netBalance

---

### Category-wise Breakdown
**GET** `/api/dashboard/category-wise`

---

### Monthly Trends
**GET** `/api/dashboard/monthly`

---

### Recent Activity
**GET** `/api/dashboard/recent`

---

## /user

User management endpoints (Admin only)

Examples:
- Get all users
- Update user role
- Change user status

---

## Validation

- Implemented using Zod
- Centralized validation middleware
- Ensures structured and safe input handling

---

## Error Handling

- Global error handler middleware
- Consistent error response format
- Proper HTTP status codes

---

## Assumptions

- Each record belongs to a single user
- Soft delete is used instead of hard delete
- Viewer cannot access record APIs
- JWT-based authentication is used

---

## Setup Instructions

```bash
git clone <repo-url>
cd backend
npm install
npm run dev
```

---

## Environment Variables

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## Notes

This project demonstrates:

- Modular backend architecture
- Clean separation of concerns
- Secure role-based access control
- Efficient data aggregation using MongoDB
- Production-level validation and error handling