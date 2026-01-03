import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // import Link
import api from "../api/axios";
import { setToken } from "../utils/auth";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login/", form);
      setToken(res.data.access);

      // Redirect to dashboard (root page)
      navigate("/");
    } catch (error) {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col gap-4 p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="border px-3 py-2 rounded"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border px-3 py-2 rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-sm text-center mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
