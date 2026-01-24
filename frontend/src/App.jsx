import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import Verify from './pages/Verify'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOTP'
import ChangePassword from './pages/ChangePassword'
import Dashboard from './pages/Dashboard'
import HealthMetricsForm from './pages/HealthMetricsForm'
import Medications from './pages/Medications'
import MedicationForm from './pages/MedicationForm'
// Helper Booking System Pages
import HelperRegister from './pages/HelperRegister'
import HelperLogin from './pages/HelperLogin'
import HelperPayment from './pages/HelperPayment'
import HelperDashboard from './pages/HelperDashboard'
import PatientRegister from './pages/PatientRegister'
import PatientLogin from './pages/PatientLogin'
import PatientDashboard from './pages/PatientDashboard'
import BrowseHelpers from './pages/BrowseHelpers'
import CreateBooking from './pages/CreateBooking'
import AdminDashboard from './pages/AdminDashboard'
import HelperBookingHome from './pages/HelperBookingHome'
import PatientVerifyEmail from './pages/PatientVerifyEmail'

const router=createBrowserRouter([
  {
    path:'/',
    element:<ProtectedRoute><Navbar/><Dashboard/></ProtectedRoute>
  },
  {
    path:'/dashboard',
    element:<ProtectedRoute><Navbar/><Dashboard/></ProtectedRoute>
  },
  {
    path:'/health-metrics/add',
    element:<ProtectedRoute><Navbar/><HealthMetricsForm/></ProtectedRoute>
  },
  {
    path:'/health-metrics/edit/:id',
    element:<ProtectedRoute><Navbar/><HealthMetricsForm/></ProtectedRoute>
  },
  {
    path:'/medications',
    element:<ProtectedRoute><Navbar/><Medications/></ProtectedRoute>
  },
  {
    path:'/medications/add',
    element:<ProtectedRoute><Navbar/><MedicationForm/></ProtectedRoute>
  },
  {
    path:'/medications/edit/:id',
    element:<ProtectedRoute><Navbar/><MedicationForm/></ProtectedRoute>
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/verify',
    element:<VerifyEmail/>
  },
  {
    path:'/verify/:token',
    element:<Verify/>
  },
  {
    path:'/forgot-password',
    element:<ForgotPassword/>
  },
  {
    path:'/verify-otp/:email',
    element:<VerifyOTP/>
  },
  {
    path:'/change-password/:email',
    element:<ChangePassword/>
  },
  // Helper Booking System Routes
  {
    path:'/helper/register',
    element:<HelperRegister/>
  },
  {
    path:'/helper/login',
    element:<HelperLogin/>
  },
  {
    path:'/helper/payment',
    element:<HelperPayment/>
  },
  {
    path:'/helper/dashboard',
    element:<ProtectedRoute userType="helper"><HelperDashboard/></ProtectedRoute>
  },
  {
    path:'/patient/register',
    element:<PatientRegister/>
  },
  {
    path:'/patient/login',
    element:<PatientLogin/>
  },
  {
    path:'/patient/verify/:token',
    element:<PatientVerifyEmail/>
  },
  {
    path:'/patient/dashboard',
    element:<ProtectedRoute userType="patient"><PatientDashboard/></ProtectedRoute>
  },
  {
    path:'/booking/helpers',
    element:<BrowseHelpers/>
  },
  {
    path:'/booking/helper/:helperId',
    element:<ProtectedRoute userType="patient"><CreateBooking/></ProtectedRoute>
  },
  {
    path:'/patient/bookings',
    element:<ProtectedRoute userType="patient"><PatientDashboard/></ProtectedRoute>
  },
  {
    path:'/admin/dashboard',
    element:<ProtectedRoute userType="admin"><AdminDashboard/></ProtectedRoute>
  },
  {
    path:'/helper-booking',
    element:<HelperBookingHome/>
  }
])
const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
