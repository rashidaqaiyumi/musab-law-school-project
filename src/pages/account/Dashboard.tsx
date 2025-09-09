import { Link } from "react-router-dom";

export default function AccountDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl mb-6">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/student/saved-courses" className="block border rounded-xl p-5 hover:shadow">
          <h2 className="font-semibold text-lg">Saved Courses</h2>
          <p className="text-sm text-gray-600 mt-1">See all courses you’ve saved.</p>
        </Link>

        <Link to="/student/purchased-courses" className="block border rounded-xl p-5 hover:shadow">
          <h2 className="font-semibold text-lg">Purchased Courses</h2>
          <p className="text-sm text-gray-600 mt-1">Courses you have bought.</p>
        </Link>

        <Link to="/student/enrolled-courses" className="block border rounded-xl p-5 hover:shadow">
          <h2 className="font-semibold text-lg">Enrolled Courses</h2>
          <p className="text-sm text-gray-600 mt-1">Continue your learning.</p>
        </Link>

        <Link to="/student/profile" className="block border rounded-xl p-5 hover:shadow">
          <h2 className="font-semibold text-lg">Profile</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your details.</p>
        </Link>
      </div>
    </div>
  );
}
