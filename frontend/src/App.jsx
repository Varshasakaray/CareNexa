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

const router=createBrowserRouter([
  {
    path:'/',
    element:<ProtectedRoute><Navbar/></ProtectedRoute>
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
    <div className='text-red-700'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
