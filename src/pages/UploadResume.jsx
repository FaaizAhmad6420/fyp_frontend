import { useState } from "react";
import api from "../api/axios";

function UploadResume() {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    await api.post("resumes/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Resume uploaded successfully");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Upload Resume</button>
    </form>
  );
}

export default UploadResume;
