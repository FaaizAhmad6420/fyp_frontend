import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications/history/");
        setApplications(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>
            My Applications
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {loading ? "Loading..." : `${applications.length} application${applications.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {loading && <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Loading applications...</p>}

        {!loading && applications.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>No applications yet. Browse jobs to get started.</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {applications.map((app) => {
            const score = app.ats_score ?? 0;
            const scoreColor = score >= 75 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";
            const barColor = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

            return (
              <div
                key={app.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "var(--transition)",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                {/* Header */}
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, marginBottom: "4px", letterSpacing: "-0.2px" }}>
                    {app.job?.title || "Job"}
                  </h2>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {app.job?.company || "N/A"}
                  </p>
                </div>

                {/* Status + score row */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "99px",
                    fontSize: "12px",
                    fontWeight: 500,
                    background: app.status === "submitted" ? "var(--success-bg)" : "var(--warning-bg)",
                    color: app.status === "submitted" ? "var(--success)" : "var(--warning)",
                  }}>
                    {app.status}
                  </span>
                </div>

                {/* ATS Bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>ATS Score</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: scoreColor }}>{score}%</span>
                  </div>
                  <div style={{ height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${score}%`, background: barColor, borderRadius: "99px", transition: "width 0.6s ease" }} />
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => navigate(`/applications/${app.id}`)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      background: "var(--navy)",
                      color: "#fff",
                      fontFamily: "var(--font-body)",
                      fontSize: "12.5px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                  >
                    View →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Applications;
