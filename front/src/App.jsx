// 📄 src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterStudentPage from "./pages/RegisterStudentPage";
import RegisterProfessorPage from "./pages/RegisterProfessorPage";
import DashboardStudent from "./pages/DashboardStudent";
import DashboardProfessor from "./pages/DashboardProfessor";
import DashboardAdmin from "./pages/DashboardAdmin";
import Navbar from "./components/Navbar";
import EnrollmentStudent from './pages/EnrollmentStudent';
import EnrollmentProfessor from './pages/EnrollmentProfessor';
import Verified from './pages/Verified';
import Unverified from './pages/Unverified'
import Attendance from './pages/Attendance'

function App() {
  return (
    <Router>
      <Navbar /> {}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register/student" element={<RegisterStudentPage />} />
        <Route path="/register/professor" element={<RegisterProfessorPage />} />
        <Route path="/dashboard/student" element={<DashboardStudent />} />
        <Route path="/dashboard/professor" element={<DashboardProfessor />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/enrollment/student" element={<EnrollmentStudent />} />
        <Route path="/enrollment/professor" element={<EnrollmentProfessor />} />
        <Route path="/attendance/unverified" element={<Unverified />} />
        <Route path="/attendance/verified" element={<Verified />} />
        <Route path="/attendance/student" element={<Attendance />} />
      </Routes>
    </Router>
  );
}

export default App;

