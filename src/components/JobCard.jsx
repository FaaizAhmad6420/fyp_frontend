import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const score = job.match_score ?? 0;
  const scoreColor = score >= 70 ? "var(--success)" : score >= 25 ? "#b45309" : "var(--text-secondary)";
  const scoreBg = score >= 70 ? "var(--success-bg)" : score >= 25 ? "var(--warning-bg)" : "#f3f4f6";

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "22px 24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: "16px",
      transition: "var(--transition)",
      cursor: "default",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
      e.currentTarget.style.borderColor = "var(--border-strong)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "var(--border)";
    }}
    >
      {/* Header */}
      <div>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "16px",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "8px",
          letterSpacing: "-0.2px",
        }}>
          {job.title}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <path d="M3 21l1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{job.company}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{job.location}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {job.match_score !== undefined && (
          <span style={{
            padding: "4px 10px",
            borderRadius: "99px",
            fontSize: "12px",
            fontWeight: 600,
            color: scoreColor,
            background: scoreBg,
          }}>
            {score}% match
          </span>
        )}

        {job.job_id && (
          <Link to={`/jobs/${job.job_id}`} style={{
            background: "var(--navy)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "var(--radius-sm)",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            transition: "var(--transition)",
            marginLeft: "auto",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--navy-light)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--navy)"}
          >
            View job →
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;
