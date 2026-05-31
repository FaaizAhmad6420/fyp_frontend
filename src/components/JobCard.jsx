import { Link } from "react-router-dom";

const JobCard = ({ job }) => {

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">

      {/* Job Info */}
      <div>

        <h3 className="text-xl font-semibold mb-2">
          {job.title}
        </h3>

        <p className="text-gray-600">
          <span className="font-medium">
            Company:
          </span>{" "}
          {job.company}
        </p>

        <p className="text-gray-600">
          <span className="font-medium">
            Location:
          </span>{" "}
          {job.location}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-3">

        {/* Match Score */}
        

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap justify-between">
          {job.match_score !== undefined && (
          <span
            className={`w-fit h-fit px-3 py-1 rounded-full text-sm font-semibold
            ${
              job.match_score > 0
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            Match: {job.match_score}%
          </span>
        )}
          {job.job_id && (
            <Link
              to={`/jobs/${job.job_id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              View Job
            </Link>
          )}

        </div>
      </div>
    </div>
  );
};

export default JobCard;