import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const navigation = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await api.post("/resumes/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("success");
      setFile(null);
      navigation("/resumes");
    } catch (error) {
      setMessage("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "60px 24px" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>

          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}>
              Upload Resume
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              We'll parse and analyze it to match you with the best jobs.
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "32px",
          }}>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("resume-file-input").click()}
              style={{
                border: `2px dashed ${dragOver ? "var(--accent)" : file ? "var(--success)" : "var(--border-strong)"}`,
                borderRadius: "var(--radius-md)",
                padding: "36px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "var(--accent-light)" : file ? "var(--success-bg)" : "var(--bg)",
                transition: "var(--transition)",
                marginBottom: "20px",
              }}
            >
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.docx"
                style={{ display: "none" }}
                onChange={(e) => { setFile(e.target.files[0]); setMessage(""); }}
              />

              {file ? (
                <>
                  <div style={{ marginBottom: "10px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.5" style={{ margin: "0 auto" }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <polyline points="9 15 11 17 15 13" />
                    </svg>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--success)", marginBottom: "4px" }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: "12px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ margin: "0 auto" }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Drop your resume here
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    or click to browse · PDF or DOCX
                  </p>
                </>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: "var(--navy)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading || !file ? "not-allowed" : "pointer",
                opacity: loading || !file ? 0.55 : 1,
                transition: "var(--transition)",
              }}
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </button>

            {/* Message */}
            {message === "error" && (
              <div style={{
                marginTop: "14px",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                background: "var(--danger-bg)",
                border: "1px solid #fecaca",
                color: "var(--danger)",
                fontSize: "13px",
                textAlign: "center",
              }}>
                Failed to upload resume. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
