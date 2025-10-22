import React, { createContext, useState, useContext, useEffect } from "react";
import { studentsAPI, subjectsAPI, attendanceAPI } from "../services/api";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  // New alias state for domain migration (drivers)
  const [drivers, setDrivers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data from backend API
  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (token) {
        console.log("🔄 Loading data from backend...");
        // Fetch from backend API
        const [studentsRes, subjectsRes] = await Promise.all([
          studentsAPI.getAll().catch((err) => {
            console.error(
              "Students API error:",
              err.response?.data || err.message
            );
            return { data: { data: [] } };
          }),
          subjectsAPI.getAll().catch((err) => {
            console.error(
              "Subjects API error:",
              err.response?.data || err.message
            );
            return { data: { data: [] } };
          }),
        ]);

        console.log("✅ Students loaded:", studentsRes.data.data?.length || 0);
        console.log("✅ Subjects loaded:", subjectsRes.data.data?.length || 0);

        const list = studentsRes.data.data || [];
        setStudents(list);
        // keep drivers in sync as an alias for the migration
        setDrivers(list);
        setSubjects(subjectsRes.data.data || []);
      } else {
        console.log("❌ No token found, falling back to localStorage");
        // Fallback to localStorage if no token
        const studentsData = JSON.parse(
          localStorage.getItem("students") || "[]"
        );
        const subjectsData = JSON.parse(
          localStorage.getItem("subjects") || "[]"
        );
        setStudents(studentsData);
        setDrivers(studentsData);
        setSubjects(subjectsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      // Fallback to localStorage if backend is not available
      const studentsData = JSON.parse(localStorage.getItem("students") || "[]");
      const subjectsData = JSON.parse(localStorage.getItem("subjects") || "[]");
      setStudents(studentsData);
      setDrivers(studentsData);
      setSubjects(subjectsData);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("📍 Token detected, loading data...");
      loadData();
    } else {
      console.log("📍 No token on mount, waiting for login...");
    }
  }, []);

  // Also listen for storage events (when token is set)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" && e.newValue) {
        console.log("📍 Token added, loading data...");
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Student operations - Now using backend API
  const addStudent = async (student) => {
    try {
      const response = await studentsAPI.create({
        studentId: student.studentId || `STU${Date.now()}`,
        name: student.name,
        email: student.email,
        phone: student.phone || "",
        department: student.department || "",
        semester: student.semester || 1,
        password: student.password || "student123",
      });

      if (response.data.success) {
        await loadData(); // Reload data from backend
        return response.data;
      }
    } catch (error) {
      console.error("Error adding student:", error);
      throw error;
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      await studentsAPI.update(id, updatedData);
      await loadData(); // Reload data from backend
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await studentsAPI.delete(id);
      await loadData(); // Reload data from backend
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  };

  // Driver operations - aliases for migration
  const addDriver = async (driver) => addStudent(driver);
  const updateDriver = async (id, updatedData) =>
    updateStudent(id, updatedData);
  const deleteDriver = async (id) => deleteStudent(id);

  // Subject operations - Now using backend API
  const addSubject = async (subject) => {
    try {
      const response = await subjectsAPI.create({
        subjectCode: subject.code || subject.subjectCode,
        subjectName: subject.name || subject.subjectName,
        credits: subject.credits || 3,
        department: subject.department || "",
        teacherId: subject.teacherId || null,
      });

      if (response.data.success) {
        await loadData(); // Reload data from backend
        return response.data;
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      throw error;
    }
  };

  const updateSubject = async (id, updatedData) => {
    try {
      await subjectsAPI.update(id, {
        subjectCode: updatedData.code || updatedData.subjectCode,
        subjectName: updatedData.name || updatedData.subjectName,
        credits: updatedData.credits,
        department: updatedData.department,
      });
      await loadData(); // Reload data from backend
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  };

  const deleteSubject = async (id) => {
    try {
      await subjectsAPI.delete(id);
      await loadData(); // Reload data from backend
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  };

  // Attendance operations - Now using backend API
  const addAttendanceRecord = async (record) => {
    try {
      // backend expects `date` field (not attendanceDate)
      const response = await attendanceAPI.markAttendance({
        studentId: record.studentId,
        subjectId: record.subjectId,
        date: record.date || new Date().toISOString().split("T")[0],
        status: record.status,
        markedBy: record.teacherId,
      });

      if (response.data.success) {
        // Update local state
        const newRecord = {
          ...record,
          id: response.data.attendanceId,
          timestamp: new Date().toISOString(),
        };
        setAttendanceRecords([...attendanceRecords, newRecord]);
        return newRecord;
      }
    } catch (error) {
      console.error("Error adding attendance:", error);
      throw error;
    }
  };

  const addBulkAttendance = async (records) => {
    try {
      // Use `date` key to match backend (/attendance/bulk expects date)
      const response = await attendanceAPI.bulkMark({
        records: records.map((r) => ({
          studentId: r.studentId,
          subjectId: r.subjectId,
          date: r.date || new Date().toISOString().split("T")[0],
          status: r.status,
          markedBy: r.teacherId,
        })),
      });

      if (response.data.success) {
        // Update local state
        const newRecords = records.map((record, index) => ({
          ...record,
          id: `ATT${Date.now()}${index}`,
          timestamp: new Date().toISOString(),
        }));
        setAttendanceRecords([...attendanceRecords, ...newRecords]);
        return newRecords;
      }
    } catch (error) {
      console.error("Error adding bulk attendance:", error);
      throw error;
    }
  };

  // Telemetry operations - alias wrappers for migration
  const addTelemetryRecord = async (record) => addAttendanceRecord(record);
  const addBulkTelemetry = async (records) => addBulkAttendance(records);

  const getStudentAttendance = async (studentId, subjectId = null) => {
    try {
      const response = await attendanceAPI.getByStudent(studentId);
      let records = response.data.data || [];

      if (subjectId) {
        records = records.filter(
          (r) => r.subject_id === subjectId || r.subjectId === subjectId
        );
      }
      return records;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return [];
    }
  };

  const getAttendanceStats = (studentId, subjectId = null) => {
    const records = getStudentAttendance(studentId, subjectId);
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { total, present, absent, percentage };
  };

  // Telemetry wrappers
  const getDriverTelemetry = async (driverId, routeId = null) =>
    getStudentAttendance(driverId, routeId);

  const getTelemetryStats = (driverId, routeId = null) =>
    getAttendanceStats(driverId, routeId);

  const value = {
    students,
    drivers,
    subjects,
    attendanceRecords,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    addDriver,
    updateDriver,
    deleteDriver,
    addSubject,
    updateSubject,
    deleteSubject,
    addAttendanceRecord,
    addBulkAttendance,
    getStudentAttendance,
    getAttendanceStats,
    // telemetry aliases
    addTelemetryRecord,
    addBulkTelemetry,
    getDriverTelemetry,
    getTelemetryStats,
    loadData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
