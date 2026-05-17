import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

const Jobs = () => {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

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

    setLoading(true);
    setError("");

    try {

      await api.get("/jobs/fetch/");

      await fetchJobs();

    } catch (err) {

      setError("Failed to refresh jobs");

    } finally {

      setLoading(false);
    }
  };

  const generateTailoredResume = async (jobId) => {

    try {

      setGenerating(true);

      // Fetch latest resume
      const resumeResponse = await api.get("/resumes/upload/");

      const resumes = resumeResponse.data;

      if (resumes.length === 0) {
        alert("Upload resume first");
        return;
      }

      const latestResume = resumes[resumes.length - 1];

      await api.post(
        "/resumes/generate-tailored-resume/",
        {
          resume_id: latestResume.id,
          job_id: jobId,
        }
      );

      alert("Tailored Resume Generated");

      navigate("/resumes");

    } catch (err) {

      console.error(err);

      alert("Generation failed");

    } finally {

      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Matched Jobs
          </h1>

          <button
            onClick={refreshJobs}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Refresh Jobs
          </button>
        </div>

        {loading && (
          <p className="text-gray-500">
            Loading job matches...
          </p>
        )}

        {error && (
          <p className="text-red-500 font-medium">
            {error}
          </p>
        )}

        {generating && (
          <div className="mb-4 text-purple-700 font-semibold">
            Generating tailored resume using AI...
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <p className="text-gray-600">
            No jobs found.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {jobs.map((job) => (
            <JobCard
              key={job.job_id}
              job={job}
              onGenerate={generateTailoredResume}
            />
          ))}

        </div>
      </div>
    </div>
  );
};

export default Jobs;