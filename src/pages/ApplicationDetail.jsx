import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

/**
 * Converts raw markdown-in-HTML text (as stored in DB) to clean HTML.
 * Handles **bold**, ### headings, * bullet lists, and &nbsp; spacing.
 */
const renderContent = (html) => {
  if (!html) return "";

  // Decode &nbsp; back to regular spaces
  let text = html.replace(/&nbsp;/g, " ");

  // If the content is wrapped in <p> tags already (cover letter), return as-is
  // (just with &nbsp; fixed above). Otherwise parse markdown.
  const hasHtmlTags = /<(h[1-6]|ul|ol|li|strong|em|p)\b/i.test(text);
  if (hasHtmlTags) return text;

  // --- Markdown → HTML for resume ---

  // ### Heading 3
  text = text.replace(/###\s+(.+?)(?=\s{2,}|\n|$)/g, "<h3>$1</h3>");
  // ## Heading 2
  text = text.replace(/##\s+(.+?)(?=\s{2,}|\n|$)/g, "<h2>$1</h2>");

  // **bold**
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // * bullet items — each item preceded by "* "
  text = text.replace(/\*\s+(.+?)(?=\s+\*\s+|\s+<h|$)/g, "<li>$1</li>");
  // Wrap consecutive <li> in <ul>
  text = text.replace(/(<li>.*?<\/li>)+/gs, (match) => `<ul>${match}</ul>`);

  // Split on double spaces (used as paragraph breaks in the DB content)
  const segments = text.split(/\s{2,}/);
  const wrapped = segments
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (s.startsWith("<h") || s.startsWith("<ul")) return s;
      return `<p>${s}</p>`;
    })
    .join("\n");

  return wrapped;
};

const SectionCard = ({ title, icon, children }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg">{icon}</span>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <div
        className="
          prose prose-sm max-w-none p-6
          prose-headings:font-semibold prose-headings:text-gray-800
          prose-h1:text-xl prose-h1:mb-3
          prose-h2:text-lg prose-h2:mb-2 prose-h2:mt-5
          prose-h3:text-base prose-h3:mb-1 prose-h3:mt-4
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-2
          prose-ul:my-2 prose-li:text-gray-700 prose-li:leading-relaxed
          prose-strong:text-gray-800
        "
        dangerouslySetInnerHTML={{ __html: children }}
      />
    </div>
  </div>
);

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);

  useEffect(() => {
    fetchApp();
  }, []);

  const fetchApp = async () => {
    try {
      const res = await api.get(`/applications/detail/${id}/`);
      setApp(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <p className="p-6 text-gray-500">Loading application...</p>
      </div>
    );
  }

  const atsColor =
    app.ats_score >= 75
      ? "bg-green-500"
      : app.ats_score >= 50
      ? "bg-yellow-500"
      : "bg-red-400";

  const atsTextColor =
    app.ats_score >= 75
      ? "text-green-700"
      : app.ats_score >= 50
      ? "text-yellow-700"
      : "text-red-700";

  const atsBgColor =
    app.ats_score >= 75
      ? "bg-green-50"
      : app.ats_score >= 50
      ? "bg-yellow-50"
      : "bg-red-50";

  const downloadCoverLetter = async () => {
    try {
      const response = await api.get(
        `/applications/download/cover/${id}/`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "cover_letter.pdf");

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const downloadResume = async () => {
    try {
      const response = await api.get(
        `/applications/download/resume/${id}/`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 mt-6 space-y-6">

        {/* HEADER CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {app.job?.title || "Job Application"}
          </h1>
          <p className="text-gray-500 mt-1">
            {app.job?.company || "Company not available"}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${atsBgColor} ${atsTextColor}`}
            >
              ATS Score: {app.ats_score}%
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                app.status === "submitted"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {app.status}
            </span>
            <span className="text-xs text-gray-400 ml-auto">
              Applied: {new Date(app.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* ATS Bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>ATS Match</span>
              <span>{app.ats_score}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`${atsColor} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${app.ats_score}%` }}
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/applications/${id}/edit`)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            ✏️ Edit Application
          </button>
          
          <button onClick={downloadCoverLetter} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
            ⬇️ Download Cover Letter
          </button>

          <button onClick={downloadResume} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            ⬇️ Download Resume
          </button>
        </div>

        {/* COVER LETTER */}
        <SectionCard title="Cover Letter" icon="📄">
          {renderContent(app.cover_letter)}
        </SectionCard>

        {/* RESUME */}
        <SectionCard title="Tailored Resume" icon="📋">
          {renderContent(app.tailored_resume)}
        </SectionCard>

      </div>
    </div>
  );
};

export default ApplicationDetail;