import { useEffect, useState } from "react";
import axios from "axios";

function JobListing({ selectedJobId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/recruiter/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchJobs();
  }, [token]);

  const dv = (v) => (v === null || v === undefined || v === "" ? "—" : v);
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  if (loading) return <div className="rc-loading">Loading jobs...</div>;
  if (error)   return <div className="rc-message rc-message--error">{error}</div>;
  if (jobs.length === 0) return (
    <div className="rc-empty">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#CBD5E1" strokeWidth="1.5"/>
        <rect x="13" y="14" width="14" height="12" rx="2" stroke="#CBD5E1" strokeWidth="1.5"/>
        <path d="M16 14v-2a2 2 0 014 0v2" stroke="#CBD5E1" strokeWidth="1.5"/>
      </svg>
      <p>No jobs posted yet.</p>
    </div>
  );

  return (
    <div className="rc-job-list">
      {jobs.map((job) => {
        const isHighlighted = selectedJobId === job.jobId;
        return (
          <div
            key={job.jobId}
            className={`rc-job-card ${isHighlighted ? "rc-job-card--highlight" : ""}`}
          >
            <div className="rc-job-card-header">
              <div>
                <div className="rc-job-title">{dv(job.title)}</div>
                <div className="rc-job-company">{dv(job.company)}</div>
              </div>
              <div className="rc-job-meta-right">
                <div className="rc-job-date-label">Closes</div>
                <div className="rc-job-date">{formatDate(job.lastDate)}</div>
              </div>
            </div>

            <div className="rc-job-divider" />

            <div className="rc-job-body">
              {job.description && (
                <div className="rc-job-section">
                  <div className="rc-job-section-label">Description</div>
                  <p className="rc-job-section-text">{job.description}</p>
                </div>
              )}
              {job.eligibilityCriteria && (
                <div className="rc-job-section">
                  <div className="rc-job-section-label">Eligibility</div>
                  <p className="rc-job-section-text">{job.eligibilityCriteria}</p>
                </div>
              )}
              <div className="rc-job-footer">
                <span className="rc-job-posted">Posted {formatDate(job.createdAt)}</span>
                {job.jdLink && (
                  <a href={job.jdLink} target="_blank" rel="noreferrer" className="rc-jd-link">
                    View JD
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default JobListing;