import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchJobs();
  }, []);

  const refreshJobs = async () => {
    setLoading(true); // start loading
    setError(""); // reset error
    try {
      const response = await api.get("/jobs/fetch/"); // use /jobs/fetch/ API
    } catch (err) {
      setError("Failed to load job matches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Matched Jobs</h1>
          <button
            onClick={refreshJobs}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        {loading && (
          <p className="text-gray-500">Loading job matches...</p>
        )}

        {error && (
          <p className="text-red-500 font-medium">{error}</p>
        )}

        {!loading && jobs.length === 0 && (
          <p className="text-gray-600">No jobs found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
