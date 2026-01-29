# CareNexa

CareNexa is a comprehensive healthcare platform designed to connect patients with professional helpers. It simplifies the process of finding, booking, and managing healthcare assistance, ensuring a seamless experience for both patients and helpers.

## 🚀 Features

### 👥 User Roles

- **Patient:** Browse helpers, book services, track health metrics, and manage medication reminders.
- **Helper:** Register, manage profile/availability, accept/reject bookings, and track earnings.
- **Admin:** Oversee the entire platform, verify helpers, manage users, and view platform statistics.

### 🌟 Key Functionalities

- **Helper Booking System (Prāṇarakṣā):**
  - Search helpers by Pincode.
  - Book helpers for specific durations.
  - OTP-based service verification.
  - Rating and review system.
- **Health Management:**
  - Track vital health metrics.
  - Medication reminders and management.
- **Authentication & Security:**
  - Secure JWT-based authentication.
  - Role-based access control (RBAC).
  - Email verification and OTP support.
- **Admin Dashboard:**
  - Verify and approve helper registrations.
  - Monitor bookings and user activities.
  - Dynamic pricing configuration.

## 🛠️ Tech Stack

### Frontend

- **Framework:** [React](https://react.dev/) (Vite)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** Shadcn UI, Lucide React
- **State Management:** Context API
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Animations:** Framer Motion

### Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Authentication:** JWT (JSON Web Tokens), Bcryptjs
- **File Uploads:** Multer
- **Email:** Nodemailer
- **Scheduling:** Node-cron

## 📂 Project Structure

```
CareNexa/
├── backend/                # Backend API (Node.js/Express)
│   ├── controllers/        # Request handlers
│   ├── cron/               # Scheduled tasks (reminders, cleanup)
│   ├── database/           # Database connection
│   ├── emailVerify/        # Email templates and logic
│   ├── middleware/         # Auth and upload middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
│
├── frontend/               # Frontend Client (React/Vite)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state context
│   │   ├── lib/            # Utilities and API config
│   │   ├── pages/          # Application pages
│   │   └── App.jsx         # Main component
│   └── ...config files
│
└── README.md               # Project documentation
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (Local or Atlas URI)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CareNexa
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables (example):

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Start the backend server:

```bash
npm run dev
# or
npm start
```

The server will start on `http://localhost:8000`.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.
