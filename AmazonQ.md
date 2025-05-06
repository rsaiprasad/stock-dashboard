# Authentication Implementation for Stock Dashboard

## Overview

This document outlines the authentication system implemented for the Stock Dashboard application. The system provides user registration with email confirmation, JWT-based authentication, and global route protection.

## Features

- User registration with email and password
- Email confirmation via token
- JWT-based authentication
- Global auth guard with public route exceptions
- Passport.js local strategy for login
- Secure password hashing with bcrypt

## Implementation Details

### User Entity

- UUID primary key
- Name, email, and password fields
- Email confirmation status and token

### Authentication Flow

1. **Registration**:
   - User submits name, email, and password
   - System creates a new user with a confirmation token
   - System sends a confirmation email with a token link

2. **Email Confirmation**:
   - User clicks the confirmation link in the email
   - System validates the token and marks the email as confirmed

3. **Login**:
   - User submits email and password
   - System validates credentials and confirms email status
   - System issues a JWT token for authenticated requests

4. **Protected Routes**:
   - All routes are protected by default with the GlobalAuthGuard
   - Routes can be marked as public using the @Public() decorator

## API Endpoints

- `POST /auth/register`: Register a new user
- `GET /auth/confirm?token=<token>`: Confirm email address
- `POST /auth/login`: Authenticate and receive JWT token
- `GET /auth/profile`: Get current user profile (protected)

## Environment Configuration

The authentication system requires the following environment variables:

- `JWT_SECRET`: Secret key for JWT token signing
- `EMAIL_*`: SMTP server configuration for sending emails
- `FRONTEND_URL`: URL for the frontend application (for confirmation links)

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- Email confirmation is required before login
- All protected routes validate token authenticity and expiration
