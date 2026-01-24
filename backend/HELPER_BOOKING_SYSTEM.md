# 🩺 Helper Booking System - API Documentation

## Overview
Complete backend implementation for the CareNexa Helper Booking System (Prāṇarakṣā Module).

## 📁 Project Structure

### Models
- `helperModel.js` - Helper registration and profile
- `patientModel.js` - Patient/user accounts
- `bookingModel.js` - Booking management
- `ratingModel.js` - Ratings and feedback
- `pricingModel.js` - Dynamic pricing configuration

### Controllers
- `helperController.js` - Helper registration, login, availability
- `patientController.js` - Patient registration, login
- `bookingController.js` - Booking creation, OTP, completion, ratings
- `adminController.js` - Admin management (verification, pricing, reports)

### Routes
- `/helper` - Helper endpoints
- `/patient` - Patient endpoints
- `/booking` - Booking endpoints
- `/admin` - Admin endpoints (email whitelist protected)

### Middleware
- `isAuthenticated.js` - General authentication (User model)
- `isAuthenticatedHelper.js` - Helper authentication
- `isAuthenticatedPatient.js` - Patient authentication
- `isAdmin.js` - Admin access (email whitelist)
- `uploadMiddleware.js` - File upload (Multer)

## 🔐 Admin Access
Only these emails can access admin routes:
- `shashirekhasakaray@gmail.com`
- `sakaray.20233241@mnnit.ac.in`

## 📋 API Endpoints

### Helper Routes (`/helper`)

#### Public
- `POST /helper/register` - Register helper (with file upload)
- `POST /helper/payment` - Complete registration payment (₹10)
- `POST /helper/login` - Helper login

#### Protected
- `GET /helper/profile` - Get helper profile
- `PUT /helper/availability` - Toggle availability status
- `POST /helper/logout` - Helper logout

### Patient Routes (`/patient`)

#### Public
- `POST /patient/register` - Register patient
- `POST /patient/login` - Patient login

#### Protected
- `GET /patient/profile` - Get patient profile
- `POST /patient/logout` - Patient logout

### Booking Routes (`/booking`)

#### Public
- `GET /booking/helpers?pincode=XXXXXX` - Browse available helpers
- `GET /booking/helpers/:helperId` - Get helper details
- `POST /booking/calculate-price` - Calculate booking price

#### Patient Protected
- `POST /booking/create` - Create booking
- `POST /booking/:bookingId/verify-otp` - Verify booking OTP
- `POST /booking/:bookingId/cancel` - Cancel booking
- `POST /booking/:bookingId/rate` - Rate helper
- `GET /booking/history` - Get booking history

#### Helper Protected
- `POST /booking/:bookingId/accept` - Accept booking
- `POST /booking/:bookingId/reject` - Reject booking
- `POST /booking/:bookingId/complete` - Complete duty
- `GET /booking/helper/bookings` - Get helper bookings

### Admin Routes (`/admin`)

#### Helper Management
- `GET /admin/helpers/pending` - Get pending helpers
- `GET /admin/helpers` - Get all helpers (with pagination)
- `GET /admin/helpers/:helperId` - Get helper details
- `POST /admin/helpers/:helperId/approve` - Approve helper
- `POST /admin/helpers/:helperId/reject` - Reject helper (with reason)
- `POST /admin/helpers/:helperId/resubmission` - Request re-submission
- `POST /admin/helpers/:helperId/suspend` - Suspend helper

#### Patient Management
- `GET /admin/patients` - Get all patients (with pagination)

#### Booking Management
- `GET /admin/bookings` - Get all bookings (with filters)
- `GET /admin/bookings/stats` - Get booking statistics

#### Reports
- `GET /admin/ratings` - Get helper ratings report

#### Pricing Control
- `GET /admin/pricing` - Get current pricing
- `PUT /admin/pricing` - Update pricing

## 🔄 Booking Flow

1. **Patient browses helpers** by pincode
2. **Patient creates booking** (minimum 15 minutes prior)
3. **Helper receives notification** (email + in-app)
4. **Helper accepts/rejects** booking
5. **OTP sent to patient** after acceptance
6. **Patient verifies OTP** with helper (duty starts)
7. **Helper completes duty**
8. **Patient rates helper**

## 💰 Pricing Logic

- Base Price: ₹200
- Early Morning (5 AM - 8 AM): +₹50
- Night (10 PM - 5 AM): +₹100
- Emergency: Configurable extra charge

## ⏰ Auto-Features

- **Auto-fail bookings**: If helper doesn't respond within deadline
- **Auto-inactive helper**: When booked
- **Auto-active helper**: After duty completion

## 📧 Email Notifications

- Helper approval/rejection
- Booking notifications
- OTP delivery
- Duty completion reminders

## 🛡️ Security Features

- Aadhaar masking (only last 4 digits visible)
- Encrypted password storage
- JWT authentication
- Admin email whitelist
- File upload validation

## 📝 Notes

- Registration fee: ₹10 (must be paid before admin verification)
- Free cancellation: Within 10 minutes of booking
- Minimum booking time: 15 minutes prior to appointment
- Helper response deadline: 10 minutes (configurable)
