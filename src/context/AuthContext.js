import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      setUserRole(userData.role);
    }
    setLoading(false);
  }, []);

  const loginTeacher = async (email, password) => {
    try {
      const response = await authAPI.teacherLogin({ email, password });

      if (response.data.success) {
        const { token, user } = response.data;

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setCurrentUser(user);
        setUserRole("teacher");

        return { success: true };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.error || "Invalid credentials",
      };
    }
  };

  const signupTeacher = async (teacherData) => {
    try {
      const response = await authAPI.teacherSignup({
        employeeId: teacherData.employeeId,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        email: teacherData.email,
        phone: teacherData.phone,
        department: teacherData.department,
        password: teacherData.password,
      });

      if (response.data.success) {
        return {
          success: true,
          message: "Signup successful! Please login.",
        };
      }
    } catch (error) {
      console.error("Signup error:", error);

      // Handle specific error cases
      if (error.response?.status === 409) {
        return {
          success: false,
          message:
            "This email or employee ID is already registered. Please use a different one or login instead.",
        };
      }

      return {
        success: false,
        message:
          error.response?.data?.error || "Signup failed. Please try again.",
      };
    }
  };

  const loginStudent = async (studentId, email, password) => {
    try {
      const response = await authAPI.studentLogin({
        studentId,
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setCurrentUser(user);
        setUserRole("student");

        return { success: true };
      }
    } catch (error) {
      console.error("Student login error:", error);
      return {
        success: false,
        message: error.response?.data?.error || "Invalid credentials",
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentTeacher");
    localStorage.removeItem("currentStudent");
  };

  const value = {
    currentUser,
    userRole,
    loading,
    loginTeacher,
    signupTeacher,
    loginStudent,
    // Aliases for NeuroFleetX domain names
    fleetLogin: loginTeacher,
    fleetSignup: signupTeacher,
    driverLogin: loginStudent,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
