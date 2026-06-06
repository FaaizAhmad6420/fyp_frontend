import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";
import api from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/profile/");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/resumes", label: "Resumes" },
    { to: "/jobs", label: "Jobs" },
    { to: "/applications", label: "Applications" },
  ];

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav style={{
      background: "var(--navy)",
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "60px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "17px",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.3px",
        }}>
          AI Job Finder
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} style={{
            textDecoration: "none",
            padding: "6px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: "13.5px",
            fontWeight: 500,
            fontFamily: "var(--font-body)",
            color: isActive(to) ? "#fff" : "rgba(255,255,255,0.55)",
            background: isActive(to) ? "rgba(255,255,255,0.1)" : "transparent",
            transition: "var(--transition)",
          }}
          onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
          onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* User dropdown */}
      {user && (
        <div ref={dropRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropOpen(!dropOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "var(--radius-sm)",
              padding: "6px 12px 6px 8px",
              cursor: "pointer",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: "13.5px",
              fontWeight: 500,
              transition: "var(--transition)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            <div style={{
              width: "26px", height: "26px",
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 700, color: "#fff",
            }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            {user.username}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.6 }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {dropOpen && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
              minWidth: "160px",
              zIndex: 200,
            }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Signed in as</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{user.username}</p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  fontSize: "13.5px",
                  fontFamily: "var(--font-body)",
                  color: "var(--danger)",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--danger-bg)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
