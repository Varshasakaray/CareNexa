import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Verify from "./pages/Verify";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import HealthMetricsForm from "./pages/HealthMetricsForm";
import Medications from "./pages/Medications";
import MedicationForm from "./pages/MedicationForm";
// Helper Booking System Pages
import HelperRegister from "./pages/HelperRegister";
import HelperLogin from "./pages/HelperLogin";
import HelperPayment from "./pages/HelperPayment";
import HelperDashboard from "./pages/HelperDashboard";
import UserDashboard from "./pages/UserDashboard";
import BrowseHelpers from "./pages/BrowseHelpers";
import CreateBooking from "./pages/CreateBooking";
import AdminDashboard from "./pages/AdminDashboard";
import HelperBookingHome from "./pages/HelperBookingHome";
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Dashboard />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/health-metrics/add",
    element: (
      <ProtectedRoute>
        <Navbar />
        <HealthMetricsForm />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/health-metrics/edit/:id",
    element: (
      <ProtectedRoute>
        <Navbar />
        <HealthMetricsForm />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/medications",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Medications />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/medications/add",
    element: (
      <ProtectedRoute>
        <Navbar />
        <MedicationForm />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/medications/edit/:id",
    element: (
      <ProtectedRoute>
        <Navbar />
        <MedicationForm />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
        <Footer />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
        <Footer />
      </>
    ),
  },
  {
    path: "/verify",
    element: (
      <>
        <VerifyEmail />
        <Footer />
      </>
    ),
  },
  {
    path: "/verify/:token",
    element: (
      <>
        <Verify />
        <Footer />
      </>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <>
        <ForgotPassword />
        <Footer />
      </>
    ),
  },
  {
    path: "/verify-otp/:email",
    element: (
      <>
        <VerifyOTP />
        <Footer />
      </>
    ),
  },
  {
    path: "/change-password/:email",
    element: (
      <>
        <ChangePassword />
        <Footer />
      </>
    ),
  },
  // Helper Booking System Routes
  {
    path: "/helper/register",
    element: (
      <>
        <HelperRegister />
        <Footer />
      </>
    ),
  },
  {
    path: "/helper/login",
    element: (
      <>
        <HelperLogin />
        <Footer />
      </>
    ),
  },
  {
    path: "/helper/payment",
    element: (
      <>
        <HelperPayment />
        <Footer />
      </>
    ),
  },
  {
    path: "/helper/dashboard",
    element: (
      <ProtectedRoute userType="helper">
        <HelperDashboard />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/dashboard",
    element: (
      <ProtectedRoute>
        <UserDashboard />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/booking/helpers",
    element: (
      <>
        <BrowseHelpers />
        <Footer />
      </>
    ),
  },
  {
    path: "/booking/helper/:helperId",
    element: (
      <ProtectedRoute>
        <CreateBooking />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/bookings",
    element: (
      <ProtectedRoute>
        <UserDashboard />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute userType="admin">
        <AdminDashboard />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/helper-booking",
    element: (
      <>
        <HelperBookingHome />
        <Footer />
      </>
    ),
  },
]);
const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
