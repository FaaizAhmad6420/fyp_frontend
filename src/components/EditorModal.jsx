import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axios";

const EditorModal = ({ isOpen, onClose, applicationId, field, initialValue, onSaved }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  const handleSave = async () => {
    try {
      await api.patch(`/applications/update-content/${applicationId}/`, { field, value });
      alert("Saved successfully");
      onSaved(value);
      onClose();
    } catch (err) {
      alert("Failed to save");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,36,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 500,
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "#fff",
        width: "80%",
        maxWidth: "860px",
        height: "80vh",
        borderRadius: "var(--radius-xl)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            Edit {field === "cover_letter" ? "Cover Letter" : "Tailored Resume"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "4px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Editor */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <ReactQuill value={value} onChange={setValue} style={{ flex: 1, display: "flex", flexDirection: "column" }} />
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}>
          <button onClick={onClose} style={ghostBtnStyle}>Cancel</button>
          <button onClick={handleSave} style={primaryBtnStyle}>Save changes</button>
        </div>
      </div>
    </div>
  );
};

const ghostBtnStyle = {
  padding: "9px 18px",
  borderRadius: "var(--radius-sm)",
  border: "1.5px solid var(--border-strong)",
  background: "none",
  fontFamily: "var(--font-body)",
  fontSize: "13.5px",
  fontWeight: 500,
  color: "var(--text-primary)",
  cursor: "pointer",
};

const primaryBtnStyle = {
  padding: "9px 18px",
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "var(--navy)",
  color: "#fff",
  fontFamily: "var(--font-body)",
  fontSize: "13.5px",
  fontWeight: 600,
  cursor: "pointer",
};

export default EditorModal;
