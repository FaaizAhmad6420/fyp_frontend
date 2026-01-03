import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get("/jobs/match/");
        setJobs(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">Total Matches</h2>
            <p className="text-3xl font-bold">{jobs.length}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">Best Match</h2>
            <p className="text-3xl font-bold">
              {jobs.length ? `${jobs[0].match_score}%` : "N/A"}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">Status</h2>
            <p className="text-green-600 font-semibold">Active</p>
          </div>
        </div>

        {/* Matched Jobs Preview */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Top Job Matches
          </h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && jobs.length === 0 && (
            <p>No matched jobs found.</p>
          )}

          <ul className="space-y-4">
            {jobs.slice(0, 5).map((job) => (
              <li
                key={job.job_id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-gray-500">
                    {job.company} • {job.location}
                  </p>
                </div>
                <span className="font-semibold text-blue-600">
                  {job.match_score}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
