import React from 'react'
import { Navigate } from 'react-router-dom'
import { getData } from '@/context/userContext'

// Admin email whitelist
const ADMIN_EMAILS = [
  'shashirekhasakaray@gmail.com',
  'sakaray.20233241@mnnit.ac.in'
];

const ProtectedRoute = ({children, userType}) => {
  const token = localStorage.getItem('accessToken');
  const storedUserType = localStorage.getItem('userType');
  const {user} = getData();
  
  // If no token, redirect to appropriate login
  if (!token) {
    if (userType === 'helper') return <Navigate to={'/helper/login'}/>;
    if (userType === 'patient') return <Navigate to={'/patient/login'}/>;
    if (userType === 'admin') return <Navigate to={'/login'}/>;
    return <Navigate to={'/login'}/>;
  }
  
  // For admin routes, check if user email is in admin whitelist
  if (userType === 'admin') {
    if (storedUserType !== 'admin') {
      // Check if user email is admin
      const userEmail = user?.email || '';
      if (!ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        return <Navigate to={'/login'}/>;
      }
      // Update userType if email matches
      localStorage.setItem('userType', 'admin');
    }
  }
  
  // If userType is specified, check if it matches
  if (userType && storedUserType !== userType && userType !== 'admin') {
    if (userType === 'helper') return <Navigate to={'/helper/login'}/>;
    if (userType === 'patient') return <Navigate to={'/patient/login'}/>;
  }
  
  // For regular user routes, check context
  if (!userType && !user) {
    return <Navigate to={'/login'}/>;
  }
  
  return <div>{children}</div>;
}

export default ProtectedRoute