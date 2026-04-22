import { useEffect, useState } from "react";
import axios from "axios";

const STATUS_STYLES = {
  applied:     { bg: "#EFF6FF", color: "#1D4ED8" },
  shortlisted: { bg: "#FEF3C7", color: "#92400E" },
  rejected:    { bg: "#FEE2E2", color: "#991B1B" },
  selected:    { bg: "#D1FAE5", color: "#065F46" },
};

function StudentApplication({ jobId, setActiveSection }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/tnp/jobs/${jobId}/applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplicants(response.data);
      } catch {
        console.error("Failed to fetch applicants");
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchApplicants();
  }, [jobId, token]);

  const statusStyle = (s) => STATUS_STYLES[s?.toLowerCase()] || { bg: "#F1F5F9", color: "#475569" };

  if (loading) return <div className="tnp-loading">Loading applicants...</div>;

  return (
    <div className="tnp-applicants-container">

      <button className="tnp-back-btn" onClick={() => setActiveSection("jobs")}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to jobs
      </button>

      {applicants.length === 0 ? (
        <div className="tnp-empty">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#CBD5E1" strokeWidth="1.5"/>
            <path d="M14 26c0-3 2.7-5 6-5s6 2 6 5" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="20" cy="16" r="4" stroke="#CBD5E1" strokeWidth="1.5"/>
          </svg>
          <p>No students have applied yet.</p>
        </div>
      ) : (
        <div className="tnp-table-card">
          <div className="tnp-table-meta">
            {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
          </div>
          <div className="tnp-table-wrap">
            <table className="tnp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roll no.</th>
                  <th>Dept.</th>
                  <th>CGPA</th>
                  <th>Resume</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((student) => {
                  const ss = statusStyle(student.status);
                  const initials = student.name
                    ? student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                    : "ST";
                  return (
                    <tr key={student.applicationId}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="tnp-mini-avatar">{initials}</div>
                          <span className="tnp-td-name">{student.name}</span>
                        </div>
                      </td>
                      <td className="tnp-td-muted">{student.email}</td>
                      <td>{student.rollNumber}</td>
                      <td>{student.department}</td>
                      <td><strong>{student.cgpa}</strong></td>
                      <td>
                        {student.resumeLink ? (
                          <a href={student.resumeLink} target="_blank" rel="noreferrer" className="tnp-resume-link">
                            View
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </a>
                        ) : "—"}
                      </td>
                      <td>
                        <span className="tnp-status-badge" style={{ background: ss.bg, color: ss.color }}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentApplication;