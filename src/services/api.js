import axios from "axios";
import baseUrl from "./api-backend-switch";

// Create axios instance with default config
const api = axios.create({
  baseURL: (baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl) + '/api',
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // New names for NeuroFleetX roles
  fleetLogin: (credentials) => api.post("/auth/teacher/login", credentials),
  fleetSignup: (data) => api.post("/auth/teacher/signup", data),
  driverLogin: (credentials) => api.post("/auth/student/login", credentials),
  // Backwards-compatible aliases
  teacherLogin: (credentials) => api.post("/auth/teacher/login", credentials),
  teacherSignup: (data) => api.post("/auth/teacher/signup", data),
  studentLogin: (credentials) => api.post("/auth/student/login", credentials),
};

// Students API
export const studentsAPI = {
  getAll: () => api.get("/students"),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post("/students", data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getAttendance: (id) => api.get(`/students/${id}/attendance`),
};

// Drivers API (alias of Students API for domain migration)
export const driversAPI = {
  getAll: studentsAPI.getAll,
  getById: studentsAPI.getById,
  create: studentsAPI.create,
  update: studentsAPI.update,
  delete: studentsAPI.delete,
  getTelemetry: studentsAPI.getAttendance,
};

// Subjects API
export const subjectsAPI = {
  getAll: () => api.get("/subjects"),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post("/subjects", data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (data) => api.post("/attendance", data),
  bulkMark: (data) => api.post("/attendance/bulk", data),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  getBySubject: (subjectId) => api.get(`/attendance/subject/${subjectId}`),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  getStats: (params) => api.get("/attendance/stats", { params }),
  delete: (id) => api.delete(`/attendance/${id}`),
};

// Telemetry API (alias of attendance endpoints for domain migration)
export const telemetryAPI = {
  markTelemetry: attendanceAPI.markAttendance,
  bulkMark: attendanceAPI.bulkMark,
  getByDriver: attendanceAPI.getByStudent,
  getByRoute: attendanceAPI.getBySubject,
  getByDate: attendanceAPI.getByDate,
  getStats: attendanceAPI.getStats,
  delete: attendanceAPI.delete,
};

// Teachers API
export const teachersAPI = {
  getProfile: () => api.get("/teachers/profile"),
  updateProfile: (data) => api.put("/teachers/profile", data),
  getSubjects: (teacherId) => api.get(`/teachers/${teacherId}/subjects`),
  assignSubject: (teacherId, subjectId) =>
    api.post(`/teachers/${teacherId}/subjects`, { subjectId }),
};

export default api;
