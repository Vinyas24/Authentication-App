# MovieFlix Authentication App

A full-stack authentication application with Netflix-themed UI and MySQL database integration.

## Features

- ✅ User signup with validation
- ✅ User login
- ✅ Password encryption/decryption
- ✅ MySQL database integration
- ✅ Netflix-themed glassmorphism UI

## Project Structure

```
auth-app/
├── server/              # Backend Express server
│   ├── index.js        # Server entry point
│   ├── routes/         # API routes
│   ├── services/       # Database services
│   └── utils/          # Utilities (encryption, validation)
├── src/                # Frontend React app
│   ├── pages/          # Login & Signup pages
│   ├── services/       # API service
│   └── utils/          # Frontend utilities
└── database/           # Database scripts
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Run the database setup script to create/update the `user_data` table:

```bash
node database/addColumns.js
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
ENCRYPTION_KEY=your-32-character-secret-key-here!!
VITE_API_URL=http://localhost:3001/api
```

**Important**: Generate a secure 32-character encryption key for production!

### 4. Start the Backend Server

```bash
npm run server
```

The server will run on `http://localhost:3001`

### 5. Start the Frontend (in a new terminal)

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "userid": "user123",
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone_number": "+1234567890"
}
```

### POST `/api/auth/login`
Authenticate user and login.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Database Schema

The `user_data` table includes:
- `userid` (VARCHAR(50), PRIMARY KEY) - User-provided alphanumeric ID
- `username` (VARCHAR(100)) - User's full name
- `email` (VARCHAR(255), UNIQUE) - User's email
- `password` (VARCHAR(255)) - Encrypted password
- `phone_number` (VARCHAR(20)) - Optional phone number
- `created_at` (TIMESTAMP) - Account creation time
- `updated_at` (TIMESTAMP) - Last update time

## Security Notes

⚠️ **Important**: This implementation uses encryption/decryption for passwords as requested. However, in production applications, passwords should be **hashed** (one-way) using bcrypt or similar, not encrypted. Encryption allows decryption, while hashing is irreversible and more secure.

## Development

- Frontend: Vite + React
- Backend: Express.js
- Database: MySQL (Aiven Cloud)
- Password: AES-256-CBC encryption