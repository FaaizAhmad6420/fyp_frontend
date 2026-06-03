import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const res = await api.get(`/applications/detail/${id}/`);

      setApplication(res.data);
      setCoverLetter(res.data.cover_letter || "");
      setTailoredResume(res.data.tailored_resume || "");

    } catch (err) {
      console.error("Error loading application:", err);
    }
  };

  const saveChanges = async () => {
  try {
    await api.patch(`/applications/update/${id}/`, {
      cover_letter: coverLetter,
      tailored_resume: tailoredResume,
    });

    navigate(`/applications/${id}`); // redirect after save

  } catch (err) {
    console.error("Save failed:", err);
  }
};

  if (!application) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 bg-white mt-6 rounded shadow">

        <h1 className="text-2xl font-bold mb-4">
          Edit Application
        </h1>

        {/* COVER LETTER */}
        <h2 className="text-xl font-semibold mb-2">
          Cover Letter
        </h2>

        <ReactQuill
          value={coverLetter}
          onChange={setCoverLetter}
          className="mb-6"
        />

        {/* RESUME */}
        <h2 className="text-xl font-semibold mb-2">
          Tailored Resume
        </h2>

        <ReactQuill
          value={tailoredResume}
          onChange={setTailoredResume}
          className="mb-6"
        />

        {/* BUTTONS */}
        <div className="flex gap-3 mt-4">

          {/* SAVE */}
          <button
            onClick={saveChanges}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>

          {/* CANCEL */}
          <button
            onClick={() => navigate(`/applications/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
};

export default ApplicationEditor;