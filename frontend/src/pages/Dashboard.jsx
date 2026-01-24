import React from "react";
import { useQuery } from "@tanstack/react-query";
import { healthMetricsAPI } from "@/lib/api";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Scale, Droplets, Plus, TrendingUp, Calendar, Users, UserPlus, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fetch health metrics
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ["healthMetrics"],
    queryFn: async () => {
      const response = await healthMetricsAPI.getAll();
      return response.data.data || [];
    },
  });

  // Process data for charts
  const processChartData = (type) => {
    if (!metricsData) return [];
    
    const filtered = metricsData.filter(m => m.type === type);
    const sorted = filtered.sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));
    
    if (type === "bloodPressure") {
      return sorted.map(m => ({
        date: format(new Date(m.recordedAt), "MMM dd"),
        systolic: m.systolic,
        diastolic: m.diastolic,
      }));
    } else {
      return sorted.map(m => ({
        date: format(new Date(m.recordedAt), "MMM dd"),
        value: m.value,
      }));
    }
  };

  // Get latest values
  const getLatestValue = (type) => {
    if (!metricsData) return null;
    const filtered = metricsData.filter(m => m.type === type);
    if (filtered.length === 0) return null;
    const sorted = filtered.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
    return sorted[0];
  };

  const latestBP = getLatestValue("bloodPressure");
  const latestSugar = getLatestValue("bloodSugar");
  const latestWeight = getLatestValue("weight");

  const bpData = processChartData("bloodPressure");
  const sugarData = processChartData("bloodSugar");
  const weightData = processChartData("weight");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#f7ede2] via-[#caf0f8] to-[#f7ede2]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-[#00b4d8]" />
          <p className="text-gray-600 font-medium">Loading health metrics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7ede2] via-[#caf0f8] to-[#f7ede2] pb-12">
      <motion.div
        className="container mx-auto p-4 md:p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00b4d8] to-[#bbd0ff] bg-clip-text text-transparent">
              Health Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Track your health metrics and medications</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate("/health-metrics/add")}
              className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0099c4] text-white shadow-lg"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Add Metric
            </Button>
          </motion.div>
        </motion.div>

        {/* Latest Values Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Blood Pressure Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
            <Card className="border-2 border-[#00b4d8]/20 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Blood Pressure</CardTitle>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="h-6 w-6 text-[#00b4d8]" fill="#00b4d8" />
                </motion.div>
              </CardHeader>
              <CardContent>
                {latestBP ? (
                  <div>
                    <div className="text-3xl font-bold text-[#00b4d8] mb-2">
                      {latestBP.systolic}/{latestBP.diastolic}
                      <span className="text-sm text-gray-500 ml-2">mmHg</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(latestBP.recordedAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No data available</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Blood Sugar Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
            <Card className="border-2 border-[#bbd0ff]/20 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Blood Sugar</CardTitle>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Droplets className="h-6 w-6 text-[#bbd0ff]" fill="#bbd0ff" />
                </motion.div>
              </CardHeader>
              <CardContent>
                {latestSugar ? (
                  <div>
                    <div className="text-3xl font-bold text-[#bbd0ff] mb-2">
                      {latestSugar.value}
                      <span className="text-sm text-gray-500 ml-1">{latestSugar.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(latestSugar.recordedAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No data available</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Weight Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
            <Card className="border-2 border-[#eae0d5]/20 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Weight</CardTitle>
                <Scale className="h-6 w-6 text-[#eae0d5]" />
              </CardHeader>
              <CardContent>
                {latestWeight ? (
                  <div>
                    <div className="text-3xl font-bold text-[#eae0d5] mb-2">
                      {latestWeight.value}
                      <span className="text-sm text-gray-500 ml-1">{latestWeight.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(latestWeight.recordedAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No data available</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Blood Pressure Chart */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#00b4d8]/20">
              <CardHeader className="bg-gradient-to-r from-[#00b4d8]/10 to-[#caf0f8]/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00b4d8]" />
                  <CardTitle className="text-xl font-bold text-gray-800">Blood Pressure Trend</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Track your systolic and diastolic pressure over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {bpData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bpData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eae0d5" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #eae0d5',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="systolic"
                        stroke="#00b4d8"
                        strokeWidth={3}
                        name="Systolic"
                        dot={{ fill: '#00b4d8', r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="diastolic"
                        stroke="#bbd0ff"
                        strokeWidth={3}
                        name="Diastolic"
                        dot={{ fill: '#bbd0ff', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                    <Activity className="w-12 h-12 mb-4 opacity-50" />
                    <p>No blood pressure data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Blood Sugar Chart */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#bbd0ff]/20">
              <CardHeader className="bg-gradient-to-r from-[#bbd0ff]/10 to-[#caf0f8]/10">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-[#bbd0ff]" />
                  <CardTitle className="text-xl font-bold text-gray-800">Blood Sugar Trend</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Monitor your glucose levels</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {sugarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sugarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eae0d5" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #eae0d5',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#bbd0ff"
                        strokeWidth={3}
                        name="Blood Sugar (mg/dL)"
                        dot={{ fill: '#bbd0ff', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                    <Droplets className="w-12 h-12 mb-4 opacity-50" />
                    <p>No blood sugar data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Weight Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#eae0d5]/20">
              <CardHeader className="bg-gradient-to-r from-[#eae0d5]/10 to-[#f7ede2]/10">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#eae0d5]" />
                  <CardTitle className="text-xl font-bold text-gray-800">Weight Trend</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Track your weight over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {weightData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eae0d5" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #eae0d5',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#eae0d5" name="Weight (kg)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                    <Scale className="w-12 h-12 mb-4 opacity-50" />
                    <p>No weight data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="cursor-pointer bg-gradient-to-br from-[#00b4d8]/10 to-[#caf0f8]/10 border-2 border-[#00b4d8]/30 shadow-lg hover:shadow-2xl transition-all duration-300"
              onClick={() => navigate("/health-metrics/add")}
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-[#00b4d8]" />
                  Add Health Metric
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Record your blood pressure, blood sugar, or weight
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="cursor-pointer bg-gradient-to-br from-[#bbd0ff]/10 to-[#caf0f8]/10 border-2 border-[#bbd0ff]/30 shadow-lg hover:shadow-2xl transition-all duration-300"
              onClick={() => navigate("/medications")}
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-[#bbd0ff]" />
                  Manage Medications
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Add medications and set up reminders
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>

        {/* Helper Booking System Section */}
        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] bg-clip-text text-transparent">
              🩺 Helper Booking System
            </h2>
            <p className="text-gray-600 mt-2">Book verified helpers for hospital visits and medical assistance</p>
          </div>
          
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer bg-gradient-to-br from-[#ff6b6b]/10 to-[#ff8787]/10 border-2 border-[#ff6b6b]/30 shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate("/helper-booking")}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#ff6b6b]" />
                    Helper Booking
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Access the helper booking system - register as patient or helper
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer bg-gradient-to-br from-[#4ecdc4]/10 to-[#44a08d]/10 border-2 border-[#4ecdc4]/30 shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate("/booking/helpers")}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[#4ecdc4]" />
                    Browse Helpers
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Find and book verified helpers in your area by pincode
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer bg-gradient-to-br from-[#95a5a6]/10 to-[#7f8c8d]/10 border-2 border-[#95a5a6]/30 shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => {
                  const userType = localStorage.getItem('userType');
                  if (userType === 'admin') {
                    navigate("/admin/dashboard");
                  } else {
                    navigate("/helper-booking");
                  }
                }}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-[#95a5a6]" />
                    Admin Dashboard
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage helpers, bookings, and system settings (Admin only)
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            className="mt-6"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#ff6b6b]/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Quick Links</CardTitle>
                <CardDescription className="text-gray-600">Quick access to helper booking features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => navigate("/patient/register")}
                  >
                    <UserPlus className="w-4 h-4" />
                    Register as Patient
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => navigate("/patient/login")}
                  >
                    <UserPlus className="w-4 h-4" />
                    Patient Login
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => navigate("/helper/register")}
                  >
                    <Users className="w-4 h-4" />
                    Register as Helper
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => navigate("/helper/login")}
                  >
                    <Users className="w-4 h-4" />
                    Helper Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
