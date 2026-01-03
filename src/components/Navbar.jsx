import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import api from "../api/axios";
import Dropdown from "./Dropdown";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/profile/");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center relative">
      {/* Left side - App name */}
      <div className="text-xl font-bold">
        <Link to="/">AI Job Finder</Link>
      </div>

      {/* Center - Navigation links */}
      <div className="space-x-6 hidden md:flex">
        <Link to="/" className="hover:text-blue-400 transition">
          Dashboard
        </Link>

        <Link to="/resumes" className="hover:text-blue-400 transition">
          Resumes
        </Link>

        <Link to="/jobs" className="hover:text-blue-400 transition">
          Jobs
        </Link>
      </div>

      {/* Right side - Username dropdown */}
      {user && (
        <Dropdown buttonText={user.username}>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition rounded-md"
          >
            Logout
          </button>
        </Dropdown>
      )}
    </nav>
  );
};

export default Navbar;
