import { useEffect, useState } from "react";
import axios from "axios";

const MATCH_STYLE = (score) => {
  if (score === null || score === undefined) return { bg: "#F1F5F9", color: "#64748B", label: "No score yet" };
  if (score >= 75) return { bg: "#D1FAE5", color: "#065F46", label: `${score}% Match` };
  if (score >= 50) return { bg: "#FEF3C7", color: "#92400E", label: `${score}% Match` };
  return { bg: "#FEE2E2", color: "#991B1B", label: `${score}% Match` };
};

function JobListing({ selectedJobId }) {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsResponse = await axios.get("http://localhost:8080/api/tnp/jobs/student", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsResponse.data);
      } catch {
        setError("Failed to load jobs.");
      }
      try {
        const appliedResponse = await axios.get("http://localhost:8080/api/student/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppliedJobs(appliedResponse.data.map((app) => app.job.jobId));
      } catch {
        console.error("Failed to fetch applications");
      }
      setLoading(false);
    };
    if (token) fetchData();
  }, [token]);

  const handleApply = async (jobId) => {
    try {
      await axios.post("http://localhost:8080/api/student/applications", { jobId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedJobs([...appliedJobs, jobId]);
    } catch {
      console.error("Application failed");
    }
  };

  const dv = (v) => (v === null || v === undefined || v === "" ? "—" : v);
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  if (loading) return <div className="st-loading">Loading jobs...</div>;
  if (error)   return <div className="st-message st-message--error">{error}</div>;
  if (jobs.length === 0) return (
    <div className="st-empty">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#CBD5E1" strokeWidth="1.5"/>
        <rect x="13" y="14" width="14" height="12" rx="2" stroke="#CBD5E1" strokeWidth="1.5"/>
        <path d="M16 14v-2a2 2 0 014 0v2" stroke="#CBD5E1" strokeWidth="1.5"/>
      </svg>
      <p>No jobs posted yet.</p>
    </div>
  );

  return (
    <div className="st-job-list">
      {jobs.map((job) => {
        const isHighlighted = selectedJobId === job.jobId;
        const isApplied = appliedJobs.includes(job.jobId);
        const match = MATCH_STYLE(job.matchScore);

        return (
          <div key={job.jobId} className={`st-job-card ${isHighlighted ? "st-job-card--highlight" : ""}`}>

            <div className="st-job-card-header">
              <div style={{ flex: 1 }}>
                <div className="st-job-title">{dv(job.title)}</div>
                <div className="st-job-company">{dv(job.company)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <span className="st-badge" style={{ background: match.bg, color: match.color }}>
                  {match.label}
                </span>
                <div className="st-job-date" style={{ color: "#EF4444", fontSize: 12, fontWeight: 600 }}>
                  Closes {formatDate(job.lastDate)}
                </div>
              </div>
            </div>

            <div className="st-job-divider" />

            <div className="st-job-body">
              {job.description && (
                <div className="st-job-section">
                  <div className="st-job-section-label">Description</div>
                  <p className="st-job-section-text">{job.description}</p>
                </div>
              )}
              {job.eligibilityCriteria && (
                <div className="st-job-section">
                  <div className="st-job-section-label">Eligibility</div>
                  <p className="st-job-section-text">{job.eligibilityCriteria}</p>
                </div>
              )}

              <div className="st-job-footer">
                <span className="st-job-posted">Posted {formatDate(job.createdAt)}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {job.jdLink && (
                    <a href={job.jdLink} target="_blank" rel="noreferrer" className="st-jd-link">
                      View JD
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                  <button
                    className={`st-apply-btn ${isApplied ? "st-apply-btn--applied" : ""}`}
                    onClick={() => handleApply(job.jobId)}
                    disabled={isApplied}
                  >
                    {isApplied ? "Applied" : "Apply Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default JobListing;