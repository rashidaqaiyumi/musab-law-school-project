// src/pages/account/Dashboard.tsx
import { Link } from "react-router-dom";

export default function AccountDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl mb-6">Student Dashboard</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              to="/account/saved-courses"
              className="text-blue-500 hover:text-blue-700"
            >
              Saved Courses
            </Link>
          </li>
          <li>
            <Link
              to="/account/purchased-courses"
              className="text-blue-500 hover:text-blue-700"
            >
              Purchased Courses
            </Link>
          </li>
          <li>
            <Link
              to="/account/enrolled-courses"
              className="text-blue-500 hover:text-blue-700"
            >
              Enrolled Courses
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
