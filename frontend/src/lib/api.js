import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User API
export const userAPI = {
  register: (data) => api.post("/user/register", data),
  login: (data) => api.post("/user/login", data),
  verifyEmail: (token) =>
    api.post(
      "/user/verify",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    ),
  getProfile: () => api.get("/user/profile"),
  logout: () => api.post("/user/logout"),
};

// Health Metrics API
export const healthMetricsAPI = {
  getAll: (params) => api.get("/health", { params }),
  getById: (id) => api.get(`/health/${id}`),
  create: (data) => api.post("/health", data),
  update: (id, data) => api.put(`/health/${id}`, data),
  delete: (id) => api.delete(`/health/${id}`),
};

// Medications API
export const medicationsAPI = {
  getAll: (params) => api.get("/medications", { params }),
  getById: (id) => api.get(`/medications/${id}`),
  create: (data) => api.post("/medications", data),
  update: (id, data) => api.put(`/medications/${id}`, data),
  delete: (id) => api.delete(`/medications/${id}`),
};

// Helper API
export const helperAPI = {
  register: (formData) =>
    api.post("/helper/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  payment: (data) => api.post("/helper/payment", data),
  sendLoginOTP: (data) => api.post("/helper/login/send-otp", data),
  verifyLoginOTP: (data) => api.post("/helper/login/verify-otp", data),
  getProfile: () => api.get("/helper/profile"),
  updateProfile: (data) => api.put("/helper/profile", data),
  toggleAvailability: (data) => api.put("/helper/availability", data),
  logout: () => api.post("/helper/logout"),
};

// Booking API
export const bookingAPI = {
  browseHelpers: (pincode) =>
    api.get("/booking/helpers", { params: { pincode } }),
  getHelperDetails: (helperId) => api.get(`/booking/helpers/${helperId}`),
  calculatePrice: (data) => api.post("/booking/calculate-price", data),
  create: (data) => api.post("/booking/create", data),
  verifyOTP: (bookingId, otp) =>
    api.post(`/booking/${bookingId}/verify-otp`, { otp }),
  cancel: (bookingId, reason) =>
    api.post(`/booking/${bookingId}/cancel`, { reason }),
  rate: (bookingId, data) => api.post(`/booking/${bookingId}/rate`, data),
  getHistory: () => api.get("/booking/history"),
  accept: (bookingId) => api.post(`/booking/${bookingId}/accept`),
  reject: (bookingId) => api.post(`/booking/${bookingId}/reject`),
  complete: (bookingId) => api.post(`/booking/${bookingId}/complete`),
  getHelperBookings: () => api.get("/booking/helper/bookings"),
};

// Admin API
export const adminAPI = {
  getPendingHelpers: () => api.get("/admin/helpers/pending"),
  getAllHelpers: (params) => api.get("/admin/helpers", { params }),
  getHelperDetails: (helperId) => api.get(`/admin/helpers/${helperId}`),
  approveHelper: (helperId) => api.post(`/admin/helpers/${helperId}/approve`),
  rejectHelper: (helperId, reason) =>
    api.post(`/admin/helpers/${helperId}/reject`, { reason }),
  requestResubmission: (helperId, reason) =>
    api.post(`/admin/helpers/${helperId}/resubmission`, { reason }),
  suspendHelper: (helperId, reason) =>
    api.post(`/admin/helpers/${helperId}/suspend`, { reason }),
  getAllPatients: (params) => api.get("/admin/patients", { params }),
  getAllBookings: (params) => api.get("/admin/bookings", { params }),
  getBookingStats: () => api.get("/admin/bookings/stats"),
  getRatings: (params) => api.get("/admin/ratings", { params }),
  getPricing: () => api.get("/admin/pricing"),
  updatePricing: (data) => api.put("/admin/pricing", data),
};

export default api;
