import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs/match/");
      setJobs(response.data);
    } catch (err) {
      setError("Failed to load job matches");
    } finally {
      setLoading(false);
    }
  };

  const refreshJobs = async () => {
    setRefreshing(true);
    setError("");
    try {
      await api.get("/jobs/fetch/");
      await fetchJobs();
    } catch (err) {
      setError("Failed to refresh jobs");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>
              Matched Jobs
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              {loading ? "Loading..." : `${jobs.length} jobs matched to your profile`}
            </p>
          </div>

          <button
            onClick={refreshJobs}
            disabled={refreshing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "var(--radius-sm)",
              border: "1.5px solid var(--border-strong)",
              background: "var(--bg-card)",
              fontFamily: "var(--font-body)",
              fontSize: "13.5px",
              fontWeight: 500,
              color: "var(--text-primary)",
              cursor: refreshing ? "not-allowed" : "pointer",
              opacity: refreshing ? 0.6 : 1,
              transition: "var(--transition)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: refreshing ? "rotate(360deg)" : "none", transition: "1s linear" }}>
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            {refreshing ? "Refreshing..." : "Refresh Jobs"}
          </button>
        </div>

        {error && (
          <div style={{ background: "var(--danger-bg)", border: "1px solid #fecaca", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: "20px", color: "var(--danger)", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {loading && (
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Loading job matches...</p>
        )}

        {!loading && jobs.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>No jobs found. Try refreshing to fetch new matches.</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {jobs.map((job) => <JobCard key={job.job_id} job={job} />)}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
