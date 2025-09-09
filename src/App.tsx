import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import RequireAuth from "./components/ui/RequireAuth";

// Public pages
import Home from "./pages/Home";
import Courses from "./pages/courses/Courses";
import CourseDetails from "./pages/courses/CourseDetails"; // Import CourseDetails
import Faculty from "./pages/Faculty";
import Insights from "./pages/Insights";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Account pages
import Dashboard from "./pages/account/Dashboard";
import EnrolledCourses from "./pages/account/EnrolledCourses";
import SavedCourses from "./pages/account/SavedCourses";
import Profile from "./pages/account/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} /> {/* Course details route */}
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <RequireAuth role="student">
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/student/enrolled-courses"
            element={
              <RequireAuth role="student">
                <EnrolledCourses />
              </RequireAuth>
            }
          />
          <Route
            path="/student/saved-courses"
            element={
              <RequireAuth role="student">
                <SavedCourses />
              </RequireAuth>
            }
          />
          <Route
            path="/student/profile"
            element={
              <RequireAuth role="student">
                <Profile />
              </RequireAuth>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
