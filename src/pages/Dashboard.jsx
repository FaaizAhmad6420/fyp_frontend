import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const StatCard = ({ label, value, accent }) => (
  <div style={{
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "24px",
  }}>
    <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
      {label}
    </p>
    <p style={{
      fontFamily: "var(--font-display)",
      fontSize: "36px",
      fontWeight: 700,
      color: accent || "var(--text-primary)",
      letterSpacing: "-1px",
      lineHeight: 1,
    }}>
      {value}
    </p>
  </div>
);

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get("/jobs/match/");
        setJobs(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const bestScore = jobs.length ? `${jobs[0].match_score}%` : "—";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>
        {/* Page header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Your job search at a glance</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <StatCard label="Total Matches" value={loading ? "..." : jobs.length} />
          <StatCard label="Best Match" value={loading ? "..." : bestScore} accent="var(--accent)" />
          <StatCard label="Status" value="Active" accent="var(--success)" />
        </div>

        {/* Top matches */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, letterSpacing: "-0.2px" }}>
              Top Job Matches
            </h2>
            <Link to="/jobs" style={{ fontSize: "13px", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
              View all →
            </Link>
          </div>

          {loading && <p style={{ padding: "24px", color: "var(--text-secondary)", fontSize: "14px" }}>Loading...</p>}
          {error && <p style={{ padding: "24px", color: "var(--danger)", fontSize: "14px" }}>{error}</p>}
          {!loading && jobs.length === 0 && (
            <p style={{ padding: "24px", color: "var(--text-secondary)", fontSize: "14px" }}>No matched jobs found. Upload your resume first.</p>
          )}

          {jobs.slice(0, 5).map((job, i) => {
            const score = job.match_score ?? 0;
            const scoreColor = score > 70 ? "var(--success)" : score > 40 ? "var(--warning)" : "var(--text-muted)";
            return (
              <div key={job.job_id} style={{
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: i < Math.min(jobs.length, 5) - 1 ? "1px solid var(--border)" : "none",
                transition: "var(--transition)",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "2px" }}>{job.title}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{job.company} · {job.location}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: scoreColor }}>
                    {score}%
                  </span>
                  <Link to={`/jobs/${job.job_id}`} style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                    View →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
