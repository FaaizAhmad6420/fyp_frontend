import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Applications = () => {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchApplications = async () => {

      try {

        const response = await api.get(
          "/applications/history/"
        );

        setApplications(response.data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    };

    fetchApplications();

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          My Applications
        </h1>

        {loading && (
          <p>Loading applications...</p>
        )}

        {!loading && applications.length === 0 && (
          <p>No applications found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {applications.map((app) => (

            <div
              key={app.id}
              className="bg-white rounded-lg shadow p-5"
            >

              {/* Job Info */}
              <h2 className="text-xl font-semibold mb-2">
                {app.job?.title || "Job"}
              </h2>

              <p className="text-gray-600">
                Company: {app.job?.company || "N/A"}
              </p>

              {/* Status */}
              <div className="mt-3">

                <span
                  className={`
                    px-3 py-1 rounded-full text-sm font-semibold

                    ${
                      app.status === "submitted"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {app.status}
                </span>
              </div>

              {/* ATS Score */}
              <div className="mt-4">

                <p className="font-medium mb-1">
                  ATS Score
                </p>

                <div className="w-full bg-gray-200 rounded-full h-4">

                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{
                      width: `${app.ats_score}%`,
                    }}
                  ></div>

                </div>

                <p className="text-sm mt-1">
                  {app.ats_score}%
                </p>

              </div>

              {/* Cover Letter */}
              {app.cover_letter && (

                <details className="mt-4">

                  <summary className="cursor-pointer font-medium">
                    View Cover Letter
                  </summary>

                  <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                    {app.cover_letter}
                  </div>

                </details>
              )}

              {/* Tailored Resume */}
              {app.tailored_resume && (

                <details className="mt-4">

                  <summary className="cursor-pointer font-medium">
                    View Tailored Resume
                  </summary>

                  <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                    {app.tailored_resume}
                  </div>

                </details>
              )}

              {/* Date */}
              <p className="text-xs text-gray-500 mt-4">
                Applied on:
                {" "}
                {new Date(app.created_at).toLocaleString()}
              </p>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;