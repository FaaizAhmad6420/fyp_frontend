import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("auth/register/", form);
      alert("Registration Successful");
      navigate("/");
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>
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
        <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "#fff" }}>
          Talent Draft
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
            Get started for free
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: "#fff", lineHeight: 1.25, letterSpacing: "-0.5px" }}>
            Start applying smarter, not harder.
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "16px", fontSize: "14px", lineHeight: 1.7 }}>
            Upload your resume once. Our AI handles tailored applications for every job you want.
          </p>
        </div>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>© 2026 Talent Draft</div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "6px" }}>
            Create account
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "36px" }}>
            Join to get AI-powered job matches
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Username", key: "username", type: "text", placeholder: "your_username" },
              { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  style={inputStyle}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={primaryBtnStyle}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .auth-panel { display: none !important; } }
        input:focus { outline: none; border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(59,110,246,0.12); }
        button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        button { transition: var(--transition); }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1.5px solid var(--border)",
  fontSize: "14px",
  fontFamily: "var(--font-body)",
  color: "var(--text-primary)",
  background: "#fff",
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

export default Register;
