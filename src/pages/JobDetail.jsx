import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const JobDetail = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}/`);
      setJob(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const applyJob = async () => {
    try {
      setLoading(true);

      await api.post(
        "/applications/apply/",
        {
          job_id: id,
        }
      );

      alert("Application Submitted");

    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Application failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-6">

        <h1 className="text-3xl font-bold mb-4">
          {job.title}
        </h1>

        <p>
          <b>Company:</b> {job.company}
        </p>

        <p>
          <b>Location:</b> {job.location}
        </p>

        <p>
          <b>Skills:</b> {job.skills.join(", ")}
        </p>

        <hr className="my-4" />
        <b>Description:</b>
        <div
          dangerouslySetInnerHTML={{
            __html: job.description,
          }}
        />

        <div className="flex gap-4 flex-wrap mt-6">
          <button
            onClick={applyJob}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Application
          </button>

        </div>

        {loading && (
          <p className="mt-4">
            Processing...
          </p>
        )}

      </div>
    </div>
  );
};

export default JobDetail;