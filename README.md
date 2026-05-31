# PayFlow UI

A minimal React frontend for the [PayFlow](https://github.com/chamathnim/payflow) digital payment processing platform.

## Tech Stack

| | |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router v6 |
| Auth | JWT via Context API |
| Styling | Plain CSS |

## Features

- **Login** — authenticates against PayFlow API Gateway, stores JWT in localStorage
- **Wallet Dashboard** — displays balance and allows top-up
- **Transactions** — send money to other users, view transaction history
- **Protected Routes** — unauthenticated users are redirected to login

## Prerequisites

- Node.js 18+
- PayFlow backend running locally via Docker Compose

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173`

> Make sure the PayFlow API Gateway is running on `http://localhost:8080` before starting the frontend.

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx       # JWT token stored globally via Context API
├── pages/
│   ├── LoginPage.jsx         # Login form → POST /api/v1/auth/login
│   ├── DashboardPage.jsx     # Wallet balance + top-up
│   └── TransactionsPage.jsx  # Send money + transaction history
├── components/
│   ├── Navbar.jsx            # Navigation + logout
│   └── ProtectedRoute.jsx    # Redirects unauthenticated users to login
├── App.jsx                   # Route definitions
└── main.jsx                  # App entry point
```

## API Endpoints Used

| Action | Method | Endpoint |
|---|---|---|
| Login | POST | `/api/v1/auth/login` |
| Get Wallet | GET | `/api/v1/wallets/{userId}` |
| Top Up | POST | `/api/v1/wallets/topup` |
| Get Transactions | GET | `/api/v1/transactions/user/{userId}` |
| Send Money | POST | `/api/v1/transactions` |

## Backend

The backend is a Spring Boot microservices platform with an API Gateway, User Service, Wallet Service, Transaction Service, Notification Service, and Audit Service.

→ [PayFlow Backend Repository](https://github.com/chamathnim/payflow)

## Author

**Chamath** — Java & Spring Boot Developer  
[GitHub](https://github.com/chamathnim)
