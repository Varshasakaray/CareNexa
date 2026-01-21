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
