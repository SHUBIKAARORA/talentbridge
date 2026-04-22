import { useState, useEffect } from "react";
import axios from "axios";

const STATUS_STYLES = {
  applied:     { bg: "#EFF6FF", color: "#1D4ED8" },
  shortlisted: { bg: "#FEF3C7", color: "#92400E" },
  rejected:    { bg: "#FEE2E2", color: "#991B1B" },
  selected:    { bg: "#D1FAE5", color: "#065F46" },
};

const STATUS_OPTIONS = ["applied", "shortlisted", "rejected", "selected"];

function ApplicationStatus({ setActiveSection, setSelectedJobId, highlightedApplicationId }) {
  const [activeTab, setActiveTab] = useState("oncampus");
  const [onCampusApps, setOnCampusApps] = useState([]);
  const [offCampusApps, setOffCampusApps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: "", role: "", source: "", status: "applied", appliedDate: "", notes: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8080/api/student/oncampus", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => setOnCampusApps(r.data)).catch(console.error);
  }, [token]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/student/offcampus", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => setOffCampusApps(r.data)).catch(console.error);
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/student/offcampus", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffCampusApps([...offCampusApps, response.data]);
      setShowForm(false);
      setFormData({ company: "", role: "", source: "", status: "applied", appliedDate: "", notes: "" });
    } catch {
      console.error("Failed to add off-campus application");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/student/offcampus/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffCampusApps((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch {
      console.error("Failed to update status");
    }
  };

  const statusStyle = (s) => STATUS_STYLES[s] || { bg: "#F1F5F9", color: "#475569" };

  return (
    <div className="st-app-container">

      {/* Tabs */}
      <div className="st-tabs">
        <button
          className={`st-tab ${activeTab === "oncampus" ? "active" : ""}`}
          onClick={() => setActiveTab("oncampus")}
        >
          On Campus
          <span className="st-tab-count">{onCampusApps.length}</span>
        </button>
        <button
          className={`st-tab ${activeTab === "offcampus" ? "active" : ""}`}
          onClick={() => setActiveTab("offcampus")}
        >
          Off Campus
          <span className="st-tab-count">{offCampusApps.length}</span>
        </button>
      </div>

      {/* On Campus */}
      {activeTab === "oncampus" && (
        <div className="st-app-list">
          {onCampusApps.length === 0 ? (
            <div className="st-empty">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#CBD5E1" strokeWidth="1.5"/>
                <path d="M13 20h14M20 13v14" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p>No on-campus applications yet.</p>
            </div>
          ) : (
            onCampusApps.map((app) => {
              const ss = statusStyle(app.status);
              const isHighlighted = app.applicationId === highlightedApplicationId;
              return (
                <div key={app.applicationId} className={`st-app-card ${isHighlighted ? "st-app-card--highlight" : ""}`}>
                  <div className="st-app-card-header">
                    <div>
                      <div className="st-app-company">{app.title}</div>
                      <div className="st-app-role">{app.company}</div>
                    </div>
                    <span className="st-badge" style={{ background: ss.bg, color: ss.color }}>
                      {app.status}
                    </span>
                  </div>
                  <div className="st-app-meta">
                    Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </div>
                  <button
                    className="st-view-job-btn"
                    onClick={() => { setSelectedJobId(app.jobId); setActiveSection("jobs"); }}
                  >
                    View job posting
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Off Campus */}
      {activeTab === "offcampus" && (
        <div className="st-app-list">

          <button className="st-add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Add application
              </>
            )}
          </button>

          {showForm && (
            <div className="st-card" style={{ marginBottom: "1rem" }}>
              <h3 className="st-card-title" style={{ marginBottom: "1rem" }}>Add off-campus application</h3>
              <form onSubmit={handleSubmit} className="st-form">
                <div className="st-form-row">
                  <div className="st-field">
                    <label className="st-label">Company <span style={{ color: "#EF4444" }}>*</span></label>
                    <input className="st-input" name="company" value={formData.company}
                      onChange={handleChange} placeholder="e.g. Google" required />
                  </div>
                  <div className="st-field">
                    <label className="st-label">Role <span style={{ color: "#EF4444" }}>*</span></label>
                    <input className="st-input" name="role" value={formData.role}
                      onChange={handleChange} placeholder="e.g. SDE Intern" required />
                  </div>
                </div>

                <div className="st-form-row">
                  <div className="st-field">
                    <label className="st-label">Source</label>
                    <input className="st-input" name="source" value={formData.source}
                      onChange={handleChange} placeholder="e.g. LinkedIn, Careers page" />
                  </div>
                  <div className="st-field">
                    <label className="st-label">Applied date</label>
                    <input className="st-input" type="date" name="appliedDate"
                      value={formData.appliedDate} onChange={handleChange} />
                  </div>
                </div>

                <div className="st-field" style={{ maxWidth: 200 }}>
                  <label className="st-label">Status</label>
                  <select className="st-input" name="status" value={formData.status} onChange={handleChange}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="st-field">
                  <label className="st-label">Notes</label>
                  <textarea className="st-input" name="notes" value={formData.notes}
                    onChange={handleChange} rows="3" placeholder="Any notes about this application..." style={{ resize: "vertical" }} />
                </div>

                <button className="st-submit-btn" type="submit">Add application</button>
              </form>
            </div>
          )}

          {offCampusApps.length === 0 && !showForm ? (
            <div className="st-empty">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#CBD5E1" strokeWidth="1.5"/>
                <path d="M13 20h14M20 13v14" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p>No off-campus applications yet. Add one above!</p>
            </div>
          ) : (
            offCampusApps.map((app) => {
              const ss = statusStyle(app.status);
              return (
                <div key={app.id} className="st-app-card">
                  <div className="st-app-card-header">
                    <div>
                      <div className="st-app-company">{app.company}</div>
                      <div className="st-app-role">{app.role}</div>
                    </div>
                    <select
                      className="st-status-select"
                      value={app.status}
                      style={{ background: ss.bg, color: ss.color }}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  {app.source && <div className="st-app-meta">Via {app.source}</div>}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default ApplicationStatus;