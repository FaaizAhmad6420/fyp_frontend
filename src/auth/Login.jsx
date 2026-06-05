import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { setToken } from "../utils/auth";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login/", form);
      setToken(res.data.access);
      navigate("/");
    } catch (error) {
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--bg)",
    }}>
      {/* Left panel */}
      <div style={{
        width: "420px",
        background: "var(--navy)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 40px",
        flexShrink: 0,
      }} className="auth-panel">
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "22px",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.3px",
        }}>
          Talent Draft
        </div>

        <div>
          <div style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-body)",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}>Your edge in hiring</div>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.25,
            letterSpacing: "-0.5px",
          }}>
            Land your next role with AI-powered applications.
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "16px", fontSize: "14px", lineHeight: 1.7 }}>
            Tailored resumes and cover letters generated in seconds. Beat ATS filters automatically.
          </p>
        </div>

        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>
          © 2026 Talent Draft
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "6px",
            letterSpacing: "-0.5px",
          }}>Welcome back</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "36px" }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
                Username
              </label>
              <input
                type="text"
                placeholder="your_username"
                style={inputStyle}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={inputStyle}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" disabled={loading} style={primaryBtnStyle}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-panel { display: none !important; }
        }
        input:focus { outline: none; border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(59,110,246,0.12); }
        button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        button { transition: var(--transition); }
      `}</style>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1.5px solid var(--border)",
  fontSize: "14px",
  fontFamily: "var(--font-body)",
  color: "var(--text-primary)",
  background: "#fff",
  transition: "var(--transition)",
};

const primaryBtnStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "var(--navy)",
  color: "#fff",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  marginTop: "4px",
};

export default Login;
