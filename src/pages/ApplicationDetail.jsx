import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const renderContent = (html) => {
  if (!html) return "";
  let text = html.replace(/&nbsp;/g, " ");
  const hasHtmlTags = /<(h[1-6]|ul|ol|li|strong|em|p)\b/i.test(text);
  if (hasHtmlTags) return text;
  text = text.replace(/###\s+(.+?)(?=\s{2,}|\n|$)/g, "<h3>$1</h3>");
  text = text.replace(/##\s+(.+?)(?=\s{2,}|\n|$)/g, "<h2>$1</h2>");
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*\s+(.+?)(?=\s+\*\s+|\s+<h|$)/g, "<li>$1</li>");
  text = text.replace(/(<li>.*?<\/li>)+/gs, (match) => `<ul>${match}</ul>`);
  const segments = text.split(/\s{2,}/);
  return segments.map(s => s.trim()).filter(Boolean).map(s => s.startsWith("<h") || s.startsWith("<ul") ? s : `<p>${s}</p>`).join("\n");
};

const SectionCard = ({ title, children }) => (
  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "20px" }}>
    <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.2px" }}>{title}</h2>
    </div>
    <div
      className="prose-content"
      style={{ padding: "24px", fontSize: "14px", lineHeight: 1.8, color: "var(--text-secondary)" }}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  </div>
);

const ActionBtn = ({ onClick, children, color = "var(--navy)", border }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: "6px",
    padding: "9px 16px", borderRadius: "var(--radius-sm)",
    border: border || "none",
    background: border ? "var(--bg-card)" : color,
    color: border ? "var(--text-primary)" : "#fff",
    fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500,
    cursor: "pointer", transition: "var(--transition)",
  }}>
    {children}
  </button>
);

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);

  useEffect(() => { fetchApp(); }, []);

  const fetchApp = async () => {
    try {
      const res = await api.get(`/applications/detail/${id}/`);
      setApp(res.data);
    } catch (err) { console.error(err); }
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await api.get(url, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) { console.error("Download failed:", err); }
  };

  if (!app) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <p style={{ padding: "40px", color: "var(--text-secondary)" }}>Loading application...</p>
    </div>
  );

  const score = app.ats_score ?? 0;
  const scoreColor = score >= 75 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";
  const barColor = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  const scoreBg = score >= 75 ? "var(--success-bg)" : score >= 50 ? "var(--warning-bg)" : "var(--danger-bg)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "36px 24px" }}>

        {/* Header card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px 32px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>
                {app.job?.title || "Job Application"}
              </h1>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{app.job?.company || "Company not available"}</p>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{
                padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: 500,
                background: app.status === "submitted" ? "var(--success-bg)" : "var(--warning-bg)",
                color: app.status === "submitted" ? "var(--success)" : "var(--warning)",
              }}>
                {app.status}
              </span>
              <span style={{ padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: 600, background: scoreBg, color: scoreColor }}>
                ATS {score}%
              </span>
            </div>
          </div>

          {/* ATS bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>ATS Match Score</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: scoreColor }}>{score}%</span>
            </div>
            <div style={{ height: "8px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${score}%`, background: barColor, borderRadius: "99px", transition: "width 0.8s ease" }} />
            </div>
          </div>

          <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
            Applied {new Date(app.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
          <ActionBtn onClick={() => navigate(`/applications/${id}/edit`)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>
            Edit Application
          </ActionBtn>
          <ActionBtn onClick={() => downloadFile(`/applications/download/cover/${id}/`, "cover_letter.pdf")} border="1.5px solid var(--border-strong)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Cover Letter PDF
          </ActionBtn>
          <ActionBtn onClick={() => downloadFile(`/applications/download/resume/${id}/`, "resume.pdf")} border="1.5px solid var(--border-strong)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Resume PDF
          </ActionBtn>
        </div>

        {/* Content sections */}
        <SectionCard title="Cover Letter">
          {renderContent(app.cover_letter)}
        </SectionCard>

        <SectionCard title="Tailored Resume">
          {renderContent(app.tailored_resume)}
        </SectionCard>
      </div>

      <style>{`
        .prose-content h1 { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; }
        .prose-content h2 { font-size: 14px; font-weight: 600; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
        .prose-content h3 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-top: 14px; margin-bottom: 6px; }
        .prose-content p { margin-bottom: 10px; }
        .prose-content ul { margin-left: 18px; margin-bottom: 10px; }
        .prose-content li { margin-bottom: 5px; }
        .prose-content strong { font-weight: 600; color: var(--text-primary); }
      `}</style>
    </div>
  );
};

export default ApplicationDetail;