import { useState } from "react";
import api from "../api/axios";
import { setToken } from "../utils/auth";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("auth/login/", form);
    setToken(res.data.access);
    alert("Login Successful");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 rounded-lg shadow-md">
      <input
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
