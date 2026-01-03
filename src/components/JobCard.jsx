const JobCard = ({ job }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px",
      }}
    >
      <h3>{job.title}</h3>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p>
        <strong>Match Score:</strong>{" "}
        <span style={{ color: job.match_score > 0 ? "green" : "orange" }}>
          {job.match_score}%
        </span>
      </p>

      <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" href={job.URL}>
        View Details
      </a>
    </div>
  );
};

export default JobCard;
