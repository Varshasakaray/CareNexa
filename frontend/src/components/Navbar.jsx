import {
  LogOut,
  User,
  Stethoscope,
  LayoutDashboard,
  Pill,
  Users,
  Calendar,
  Activity,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getData } from "@/context/userContext";
import axios from "axios";
import { toast } from "sonner";

const Navbar = () => {
  const { user, setUser } = getData();
  const accessToken = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("userType");
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get user data based on userType
  const helperData =
    userType === "helper"
      ? JSON.parse(localStorage.getItem("helper") || "null")
      : null;

  const displayUser = user || helperData;

  const logoutHandler = async () => {
    try {
      let endpoint = "/user/logout";
      if (userType === "helper") {
        endpoint = "/helper/logout";
      }

      const res = await axios.post(
        `http://localhost:8000${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUser(null);
        toast.success(res.data.message);
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      // Even if API call fails, clear local storage
      setUser(null);
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b-2 border-[#eae0d5]/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Logo section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-2 items-center"
        >
          <Link
            to={
              accessToken
                ? userType === "helper"
                  ? "/helper/dashboard"
                  : userType === "admin"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                : "/"
            }
            className="flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Stethoscope
                size={40}
                className="text-[#00b4d8]"
                strokeWidth={2.5}
              />
            </motion.div>
            <h1 className="font-bold text-2xl bg-gradient-to-r from-[#00b4d8] to-[#bbd0ff] bg-clip-text text-transparent group-hover:from-[#0099c4] group-hover:to-[#a8c0ff] transition-all">
              CareNexa
            </h1>
          </Link>
        </motion.div>

        <div className="flex gap-6 items-center">
          {user || accessToken ? (
            <>
              {/* Navigation Links */}
              <ul className="hidden md:flex gap-6 items-center">
                <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to="/helper-booking"
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
                      isActive("/helper-booking")
                        ? "text-[#ff6b6b] bg-[#ff6b6b]/20"
                        : "text-gray-700 hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Home
                    </div>
                    {isActive("/helper-booking") && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#ff6b6b]/20 rounded-lg -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to={
                      userType === "helper"
                        ? "/helper/dashboard"
                        : userType === "admin"
                          ? "/admin/dashboard"
                          : "/user/dashboard"
                    }
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
                      isActive("/user/dashboard") ||
                      isActive("/helper/dashboard") ||
                      isActive("/admin/dashboard")
                        ? "text-[#00b4d8] bg-[#caf0f8]/50"
                        : "text-gray-700 hover:text-[#00b4d8] hover:bg-[#caf0f8]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </div>
                    {(isActive("/user/dashboard") ||
                      isActive("/helper/dashboard") ||
                      isActive("/admin/dashboard")) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#caf0f8]/50 rounded-lg -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to="/dashboard"
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
                      isActive("/dashboard")
                        ? "text-[#00b4d8] bg-[#caf0f8]/50"
                        : "text-gray-700 hover:text-[#00b4d8] hover:bg-[#caf0f8]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Health Metrics
                    </div>
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to={"/medications"}
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
                      isActive("/medications")
                        ? "text-[#bbd0ff] bg-[#bbd0ff]/20"
                        : "text-gray-700 hover:text-[#bbd0ff] hover:bg-[#bbd0ff]/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Medications
                    </div>
                    {isActive("/medications") && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#bbd0ff]/20 rounded-lg -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to="/booking/helpers"
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
                      isActive("/booking/helpers")
                        ? "text-[#4ecdc4] bg-[#4ecdc4]/20"
                        : "text-gray-700 hover:text-[#4ecdc4] hover:bg-[#4ecdc4]/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Browse Helpers
                    </div>
                    {isActive("/booking/helpers") && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#4ecdc4]/20 rounded-lg -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.li>
              </ul>

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="focus:outline-none"
                  >
                    <Avatar className="border-2 border-[#00b4d8]/30 hover:border-[#00b4d8] transition-all cursor-pointer ring-2 ring-offset-2 ring-offset-white ring-[#caf0f8]">
                      <AvatarImage
                        src={
                          displayUser?.profilePhoto
                            ? `http://localhost:8000/${displayUser.profilePhoto}`
                            : displayUser?.avatar
                        }
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#00b4d8] to-[#bbd0ff] text-white font-semibold">
                        {(displayUser?.username || displayUser?.fullName)
                          ?.charAt(0)
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/95 backdrop-blur-sm border-2 border-[#eae0d5] shadow-xl"
                >
                  <DropdownMenuLabel className="font-semibold text-gray-800">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#eae0d5]" />
                  <DropdownMenuItem
                    onClick={() => {
                      if (userType === "helper") {
                        window.location.href = "/helper/dashboard";
                      } else if (userType === "admin") {
                        window.location.href = "/admin/dashboard";
                      } else {
                        window.location.href = "/user/dashboard";
                      }
                    }}
                    className="cursor-pointer hover:bg-[#caf0f8]/50 focus:bg-[#caf0f8]/50"
                  >
                    <User className="w-4 h-4 mr-2 text-[#00b4d8]" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#eae0d5]" />
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Public Navigation */}
              <ul className="hidden md:flex gap-6 items-center text-lg font-semibold">
                <motion.li whileHover={{ y: -2 }}>
                  <Link
                    to={"/features"}
                    className="text-gray-700 hover:text-[#00b4d8] transition-colors"
                  >
                    Features
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }}>
                  <Link
                    to={"/about"}
                    className="text-gray-700 hover:text-[#00b4d8] transition-colors"
                  >
                    About
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }}>
                  <a
                    href="mailto:support@carenexa.com"
                    className="text-gray-700 hover:text-[#00b4d8] transition-colors"
                  >
                    Contact Us
                  </a>
                </motion.li>
              </ul>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex gap-4"
              >
                <Link to={"/login"}>
                  <button className="px-6 py-2 bg-gradient-to-r from-[#00b4d8] to-[#bbd0ff] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                    Login
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="px-6 py-2 border-2 border-[#00b4d8] text-[#00b4d8] font-semibold rounded-lg hover:bg-[#00b4d8] hover:text-white transition-all">
                    Signup
                  </button>
                </Link>
              </motion.div>
            </>
          )}
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-[#00b4d8] focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#eae0d5]"
          >
            <ul className="flex flex-col p-4 gap-4">
              {user || accessToken ? (
                <>
                  <Link
                    to="/helper-booking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                      isActive("/helper-booking")
                        ? "text-[#ff6b6b] bg-[#ff6b6b]/10"
                        : "text-gray-700 hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/5"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    Home
                  </Link>
                  <Link
                    to={
                      userType === "helper"
                        ? "/helper/dashboard"
                        : userType === "admin"
                          ? "/admin/dashboard"
                          : "/user/dashboard"
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                      isActive("/user/dashboard") ||
                      isActive("/helper/dashboard") ||
                      isActive("/admin/dashboard")
                        ? "text-[#00b4d8] bg-[#caf0f8]/50"
                        : "text-gray-700 hover:text-[#00b4d8] hover:bg-[#caf0f8]/30"
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                      isActive("/dashboard") &&
                      !isActive("/helper/dashboard") &&
                      !isActive("/patient/dashboard") &&
                      !isActive("/admin/dashboard")
                        ? "text-[#00b4d8] bg-[#caf0f8]/50"
                        : "text-gray-700 hover:text-[#00b4d8] hover:bg-[#caf0f8]/30"
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                    Health Metrics
                  </Link>
                  <Link
                    to="/medications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                      isActive("/medications")
                        ? "text-[#bbd0ff] bg-[#bbd0ff]/20"
                        : "text-gray-700 hover:text-[#bbd0ff] hover:bg-[#bbd0ff]/10"
                    }`}
                  >
                    <Pill className="w-5 h-5" />
                    Medications
                  </Link>
                  <Link
                    to="/booking/helpers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                      isActive("/booking/helpers")
                        ? "text-[#4ecdc4] bg-[#4ecdc4]/20"
                        : "text-gray-700 hover:text-[#4ecdc4] hover:bg-[#4ecdc4]/10"
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    Browse Helpers
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    onClick={() => {
                      logoutHandler();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/features"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 font-semibold text-gray-700 hover:text-[#00b4d8]"
                  >
                    Features
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 font-semibold text-gray-700 hover:text-[#00b4d8]"
                  >
                    About
                  </Link>
                  <a
                    href="mailto:support@carenexa.com"
                    className="px-4 py-2 font-semibold text-gray-700 hover:text-[#00b4d8]"
                  >
                    Contact Us
                  </a>
                  <div className="flex flex-col gap-3 mt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <button className="w-full px-6 py-2 bg-gradient-to-r from-[#00b4d8] to-[#bbd0ff] text-white font-semibold rounded-lg shadow-md">
                        Login
                      </button>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <button className="w-full px-6 py-2 border-2 border-[#00b4d8] text-[#00b4d8] font-semibold rounded-lg">
                        Signup
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
