import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      {/* Left side - App name */}
      <div className="text-xl font-bold">
        <Link to="/">AI Job Finder</Link>
      </div>

      {/* Center - Navigation links */}
      <div className="space-x-6 hidden md:flex">
        <Link
          to="/"
          className="hover:text-blue-400 transition"
        >
          Dashboard
        </Link>

        <Link
          to="/resumes"
          className="hover:text-blue-400 transition"
        >
          Resumes
        </Link>

        <Link
          to="/jobs"
          className="hover:text-blue-400 transition"
        >
          Jobs
        </Link>
      </div>

      {/* Right side - Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
