import { useState, useEffect } from "react";
import axios from "axios";

const SORT_OPTIONS = [
  { label: "Highest first", value: "desc", icon: "↓" },
  { label: "Lowest first",  value: "asc",  icon: "↑" },
];

const FILTER_OPTIONS = [
  { label: "All",           value: 0  },
  { label: "50%+ match",   value: 50 },
  { label: "75%+ match",   value: 75 },
  { label: "90%+ match",   value: 90 },
];

const STATUS_STYLES = {
  applied:     { bg: "#EFF6FF", color: "#1D4ED8" },
  shortlisted: { bg: "#FEF3C7", color: "#92400E" },
  rejected:    { bg: "#FEE2E2", color: "#991B1B" },
  selected:    { bg: "#D1FAE5", color: "#065F46" },
};

function getMatchStyle(score) {
  if (score === null || score === undefined) return { bg: "#F1F5F9", color: "#64748B" };
  if (score >= 75) return { bg: "#D1FAE5", color: "#065F46" };
  if (score >= 50) return { bg: "#FEF3C7", color: "#92400E" };
  return { bg: "#FEE2E2", color: "#991B1B" };
}

function StudentApplication() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState(null);
  const [minScore, setMinScore] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/recruiter/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch {
        console.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/recruiter/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs((prev) =>
        prev.map((job) => ({
          ...job,
          applicants: job.applicants.map((app) =>
            app.applicationId === applicationId ? { ...app, status: newStatus } : app
          ),
        }))
      );
    } catch {
      console.error("Failed to update status");
    }
  };

  const getProcessedApplicants = (applicants) => {
    let result = [...applicants];
    if (minScore > 0) result = result.filter((a) => a.matchScore !== null && a.matchScore >= minScore);
    if (sortOrder === "desc") result.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    else if (sortOrder === "asc") result.sort((a, b) => (a.matchScore ?? 0) - (b.matchScore ?? 0));
    return result;
  };

  if (loading) return <div className="rc-loading">Loading applications...</div>;

  return (
    <div className="rc-app-container">

      {/* Controls */}
      <div className="rc-controls">
        <div className="rc-controls-group">
          <span className="rc-controls-label">Sort by match</span>
          <div className="rc-pill-group">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`rc-pill ${sortOrder === opt.value ? "active" : ""}`}
                onClick={() => setSortOrder(sortOrder === opt.value ? null : opt.value)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rc-controls-group">
          <span className="rc-controls-label">Filter</span>
          <div className="rc-pill-group">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`rc-pill ${minScore === opt.value ? "active" : ""}`}
                onClick={() => setMinScore(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Job blocks */}
      {jobs.map((job) => {
        const processed = getProcessedApplicants(job.applicants);
        return (
          <div key={job.jobId} className="rc-app-job-block">

            <div className="rc-app-job-header">
              <div>
                <div className="rc-app-job-title">{job.title}</div>
                <div className="rc-app-job-company">{job.company}</div>
              </div>
              <span className="rc-app-count">
                {processed.length} / {job.applicants.length} applicants
              </span>
            </div>

            {processed.length === 0 ? (
              <div className="rc-app-empty">No applicants match the current filter.</div>
            ) : (
              <div className="rc-table-wrap">
                <table className="rc-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Roll no.</th>
                      <th>Dept.</th>
                      <th>CGPA</th>
                      <th>Match</th>
                      <th>Resume</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processed.map((student) => {
                      const matchStyle = getMatchStyle(student.matchScore);
                      const statusStyle = STATUS_STYLES[student.status] || {};
                      return (
                        <tr key={student.applicationId}>
                          <td className="rc-td-name">{student.name}</td>
                          <td className="rc-td-muted">{student.email}</td>
                          <td>{student.rollNumber}</td>
                          <td>{student.department}</td>
                          <td><strong>{student.cgpa}</strong></td>

                          <td>
                            <span className="rc-badge" style={{ background: matchStyle.bg, color: matchStyle.color }}>
                              {student.matchScore !== null && student.matchScore !== undefined
                                ? `${student.matchScore}%` : "N/A"}
                            </span>
                          </td>

                          <td>
                            {student.resumeLink ? (
                              <a href={student.resumeLink} target="_blank" rel="noreferrer" className="rc-resume-link">
                                View
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </a>
                            ) : "—"}
                          </td>

                          <td>
                            <select
                              className="rc-status-select"
                              value={student.status}
                              style={{ background: statusStyle.bg, color: statusStyle.color }}
                              onChange={(e) => updateStatus(student.applicationId, e.target.value)}
                            >
                              <option value="applied">Applied</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="rejected">Rejected</option>
                              <option value="selected">Selected</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StudentApplication;