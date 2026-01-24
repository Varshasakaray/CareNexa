import { LogOut, User, Stethoscope, LayoutDashboard, Pill, Users, Calendar, Shield } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getData } from '@/context/userContext'
import axios from 'axios'
import { toast } from 'sonner'

const Navbar = () => {
    const {user, setUser} = getData()
    const accessToken = localStorage.getItem("accessToken")
    const userType = localStorage.getItem("userType")
    const location = useLocation()
    
    // Get user data based on userType
    const helperData = userType === 'helper' ? JSON.parse(localStorage.getItem('helper') || 'null') : null
    const patientData = userType === 'patient' ? JSON.parse(localStorage.getItem('patient') || 'null') : null
    const displayUser = user || helperData || patientData

    const logoutHandler = async()=>{
        try {
            let endpoint = '/user/logout';
            if (userType === 'helper') {
                endpoint = '/helper/logout';
            } else if (userType === 'patient') {
                endpoint = '/patient/logout';
            }
            
            const res = await axios.post(`http://localhost:8000${endpoint}`,{},{
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            })
            if(res.data.success){
                setUser(null)
                toast.success(res.data.message)
                localStorage.clear()
                window.location.href = '/login'
            }
        } catch (error) {
            // Even if API call fails, clear local storage
            setUser(null)
            localStorage.clear()
            window.location.href = '/login'
        }
    }

    const isActive = (path) => location.pathname === path
    
    return (
        <nav className='sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b-2 border-[#eae0d5]/50 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center'>
                {/* Logo section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='flex gap-2 items-center'
                >
                    <Link to={accessToken ? (userType === 'helper' ? '/helper/dashboard' : userType === 'patient' ? '/patient/dashboard' : userType === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Stethoscope size={40} className="text-[#00b4d8]" strokeWidth={2.5} />
                        </motion.div>
                        <h1 className='font-bold text-2xl bg-gradient-to-r from-[#00b4d8] to-[#bbd0ff] bg-clip-text text-transparent group-hover:from-[#0099c4] group-hover:to-[#a8c0ff] transition-all'>
                            CareNexa
                        </h1>
                    </Link>
                </motion.div>

                <div className='flex gap-6 items-center'>
                    {(user || accessToken) ? (
                        <>
                            {/* Navigation Links */}
                            <ul className='hidden md:flex gap-6 items-center'>
                                <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                                    <Link
                                        to="/helper-booking"
                                        className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
                                            isActive('/helper-booking')
                                                ? 'text-[#ff6b6b] bg-[#ff6b6b]/20'
                                                : 'text-gray-700 hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Home
                                        </div>
                                        {isActive('/helper-booking') && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-[#ff6b6b]/20 rounded-lg -z-10"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                                    <Link
                                        to={userType === 'helper' ? '/helper/dashboard' : userType === 'patient' ? '/patient/dashboard' : userType === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                        className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
                                            isActive('/dashboard') || isActive('/helper/dashboard') || isActive('/patient/dashboard') || isActive('/admin/dashboard')
                                                ? 'text-[#00b4d8] bg-[#caf0f8]/50'
                                                : 'text-gray-700 hover:text-[#00b4d8] hover:bg-[#caf0f8]/30'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </div>
                                        {(isActive('/dashboard') || isActive('/helper/dashboard') || isActive('/patient/dashboard') || isActive('/admin/dashboard')) && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-[#caf0f8]/50 rounded-lg -z-10"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                </motion.li>
                                {userType !== 'helper' && userType !== 'patient' && userType !== 'admin' && (
                                    <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                                        <Link
                                            to={'/medications'}
                                            className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
                                                isActive('/medications')
                                                    ? 'text-[#bbd0ff] bg-[#bbd0ff]/20'
                                                    : 'text-gray-700 hover:text-[#bbd0ff] hover:bg-[#bbd0ff]/10'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Pill className="w-4 h-4" />
                                                Medications
                                            </div>
                                            {isActive('/medications') && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 bg-[#bbd0ff]/20 rounded-lg -z-10"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                        </Link>
                                    </motion.li>
                                )}
                                <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                                    <Link
                                        to="/booking/helpers"
                                        className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
                                            isActive('/booking/helpers')
                                                ? 'text-[#4ecdc4] bg-[#4ecdc4]/20'
                                                : 'text-gray-700 hover:text-[#4ecdc4] hover:bg-[#4ecdc4]/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Browse Helpers
                                        </div>
                                        {isActive('/booking/helpers') && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-[#4ecdc4]/20 rounded-lg -z-10"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
                                                {(displayUser?.username || displayUser?.fullName)?.charAt(0).toUpperCase() || 'U'}
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
                                            if (userType === 'helper') {
                                                window.location.href = '/helper/dashboard';
                                            } else if (userType === 'patient') {
                                                window.location.href = '/patient/dashboard';
                                            } else if (userType === 'admin') {
                                                window.location.href = '/admin/dashboard';
                                            } else {
                                                window.location.href = '/dashboard';
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
                            <ul className='hidden md:flex gap-6 items-center text-lg font-semibold'>
                                <motion.li whileHover={{ y: -2 }}>
                                    <Link to={'/features'} className='text-gray-700 hover:text-[#00b4d8] transition-colors'>
                                        Features
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{ y: -2 }}>
                                    <Link to={'/pricing'} className='text-gray-700 hover:text-[#00b4d8] transition-colors'>
                                        Pricing
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{ y: -2 }}>
                                    <Link to={'/about'} className='text-gray-700 hover:text-[#00b4d8] transition-colors'>
                                        About
                                    </Link>
                                </motion.li>
                            </ul>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to={'/login'}>
                                    <button className='px-6 py-2 bg-gradient-to-r from-[#00b4d8] to-[#bbd0ff] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all'>
                                        Login
                                    </button>
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
