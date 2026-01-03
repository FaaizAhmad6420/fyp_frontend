import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("jobs/match/");
        setJobs(response.data);
      } catch (err) {
        setError("Failed to load job matches");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  
  if (loading) return <p>Loading job matches...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Matched Jobs</h2>

      {jobs.length === 0 && <p>No jobs found</p>}

      {jobs.map((job) => (
        <JobCard key={job.job_id} job={job} />
      ))}
    </div>
  );
};

export default Jobs;