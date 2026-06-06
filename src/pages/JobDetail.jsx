import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => { fetchJob(); }, []);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}/`);
      setJob(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async () => {
    try {
      setApplying(true);
      await api.post("/applications/apply/", { job_id: id });
      alert("Application Submitted");
    } catch (err) {
      alert(err.response?.data?.error || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  if (!job) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <p style={{ padding: "40px", color: "var(--text-secondary)" }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "36px 24px" }}>
        {/* Header card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          marginBottom: "20px",
        }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "-0.5px",
            marginBottom: "14px",
          }}>
            {job.title}
          </h1>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <path d="M3 21l1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{job.company}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{job.location}</span>
            </div>
          </div>

          {/* Skills */}
          <div style={{ marginTop: "20px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
              Required Skills
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {job.skills.map((skill, i) => (
                <span key={i} style={{
                  padding: "5px 12px",
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                  borderRadius: "99px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "28px 32px",
          marginBottom: "20px",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, marginBottom: "16px", letterSpacing: "-0.2px" }}>
            Job Description
          </h2>
          <div
            style={{ fontSize: "14px", lineHeight: 1.8, color: "var(--text-secondary)" }}
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>

        {/* Apply button */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={applyJob}
            disabled={applying}
            style={{
              padding: "12px 28px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "var(--navy)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: applying ? "not-allowed" : "pointer",
              opacity: applying ? 0.7 : 1,
              transition: "var(--transition)",
            }}
          >
            {applying ? "Creating application..." : "Create Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
