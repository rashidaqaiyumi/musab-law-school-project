import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

// Importing global styles
import "./index.css";

// Pages
import Home from "./pages/Home";
import Courses from "./pages/courses/Courses";
import CourseDetails from "./pages/courses/CourseDetails";
import Faculty from "./pages/Faculty";
import LegalInsights from "./pages/LegalInsights";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";

// User role pages
import StudentDashboard from "./components/dashboards/StudentDashboard";
import FacultyDashboard from "./components/dashboards/FacultyDashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";

// Auth
import Login from "../src/auth/Login";
import Signup from "../src/auth/Signup";

// Layouts
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Router>
    <Navbar />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/faculty" element={<Faculty />} />
      <Route path="/legal-insights" element={<LegalInsights />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User Dashboard Routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
    <Footer />
  </Router>
);
