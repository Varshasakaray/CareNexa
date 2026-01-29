import React from "react";
import { Navigate } from "react-router-dom";
import { getData } from "@/context/userContext";

// Admin email whitelist
const ADMIN_EMAILS = [
  "shashirekhasakaray@gmail.com",
  "sakaray.20233241@mnnit.ac.in",
];

const ProtectedRoute = ({ children, userType }) => {
  const token = localStorage.getItem("accessToken");
  const storedUserType = localStorage.getItem("userType");
  const { user } = getData();

  // If no token, redirect to appropriate login
  if (!token) {
    if (userType === "helper") return <Navigate to={"/helper/login"} />;
    if (userType === "admin") return <Navigate to={"/login"} />;
    return <Navigate to={"/login"} />;
  }

  // For admin routes, check if user email is in admin whitelist
  if (userType === "admin") {
    if (storedUserType !== "admin") {
      // Check if user email is admin
      const userEmail = user?.email || "";
      if (!ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        return <Navigate to={"/login"} />;
      }
      // Update userType if email matches
      localStorage.setItem("userType", "admin");
    }
  }

  // If userType is specified, check if it matches
  if (userType && storedUserType !== userType && userType !== "admin") {
    // Redirect helpers to their dashboard if they try to access patient routes
    if (storedUserType === "helper" && userType === "patient") {
      return <Navigate to={"/helper/dashboard"} />;
    }

    if (userType === "helper") return <Navigate to={"/helper/login"} />;
  }

  // For regular user routes, check context
  if (!userType && !user) {
    // Allow patients to access general health routes (dashboard, medications, etc.)
    if (storedUserType === "patient" && localStorage.getItem("patient")) {
      return <div>{children}</div>;
    }
    // Allow generic users to access (will be handled by component)
    if (storedUserType === "user" || !storedUserType) {
      return <div>{children}</div>;
    }
    // Allow helpers to access general health routes
    if (storedUserType === "helper" && localStorage.getItem("helper")) {
      return <div>{children}</div>;
    }
    // Allow admins to access general health routes
    if (storedUserType === "admin" && token) {
      return <div>{children}</div>;
    }
    return <Navigate to={"/login"} />;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
