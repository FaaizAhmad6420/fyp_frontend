import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Navbar from "../components/Navbar";

const ApplicationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchApplication(); }, []);

  const fetchApplication = async () => {
    try {
      const res = await api.get(`/applications/detail/${id}/`);
      setApplication(res.data);
      setCoverLetter(res.data.cover_letter || "");
      setTailoredResume(res.data.tailored_resume || "");
    } catch (err) { console.error("Error loading application:", err); }
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      await api.patch(`/applications/update/${id}/`, { cover_letter: coverLetter, tailored_resume: tailoredResume });
      navigate(`/applications/${id}`);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!application) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <p style={{ padding: "40px", color: "var(--text-secondary)" }}>Loading...</p>
    </div>
  );

  const sectionLabel = {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "10px",
    display: "block",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "36px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>
              Edit Application
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {application.job?.title} · {application.job?.company}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate(`/applications/${id}`)}
              style={{
                padding: "9px 18px",
                borderRadius: "var(--radius-sm)",
                border: "1.5px solid var(--border-strong)",
                background: "var(--bg-card)",
                fontFamily: "var(--font-body)",
                fontSize: "13.5px",
                fontWeight: 500,
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              style={{
                padding: "9px 20px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: "var(--navy)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
                transition: "var(--transition)",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Cover Letter editor */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: "20px" }}>
          <span style={sectionLabel}>Cover Letter</span>
          <ReactQuill value={coverLetter} onChange={setCoverLetter} />
        </div>

        {/* Resume editor */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px" }}>
          <span style={sectionLabel}>Tailored Resume</span>
          <ReactQuill value={tailoredResume} onChange={setTailoredResume} />
        </div>
      </div>
    </div>
  );
};

export default ApplicationEditor;
