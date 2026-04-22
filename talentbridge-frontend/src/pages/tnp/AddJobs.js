import { useState, useEffect } from "react";
import axios from "axios";

function AddJobs() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    eligibilityCriteria: "",
    jdLink: "",
    lastDate: "",
    recruiterIds: [],
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [recruiters, setRecruiters] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tnp/recruiters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecruiters(response.data);
      } catch {
        console.error("Failed to fetch recruiters");
      }
    };
    if (token) fetchRecruiters();
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRecruiterSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData({ ...formData, recruiterIds: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await axios.post("http://localhost:8080/api/tnp/jobs", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: "Job posted successfully!", type: "success" });
      setFormData({ title: "", company: "", description: "", eligibilityCriteria: "", jdLink: "", lastDate: "", recruiterIds: [] });
    } catch {
      setMessage({ text: "Failed to post job. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="tnp-card">
        <div className="tnp-card-header">
          <div className="tnp-card-icon tnp-card-icon--indigo">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="9" rx="2" stroke="#A5B4FC" strokeWidth="1.4"/>
              <path d="M5 7h6M5 10h4" stroke="#A5B4FC" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h2 className="tnp-card-title">Post a new job</h2>
            <p className="tnp-card-sub">Fill in the details and assign recruiters to notify them.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="tnp-form">

          <div className="tnp-form-row">
            <div className="tnp-field">
              <label className="tnp-label">Job title <span className="tnp-required">*</span></label>
              <input className="tnp-input" type="text" name="title"
                value={formData.title} onChange={handleChange} placeholder="e.g. Software Engineer Intern" required />
            </div>
            <div className="tnp-field">
              <label className="tnp-label">Company <span className="tnp-required">*</span></label>
              <input className="tnp-input" type="text" name="company"
                value={formData.company} onChange={handleChange} placeholder="e.g. Google" required />
            </div>
          </div>

          <div className="tnp-field">
            <label className="tnp-label">Description</label>
            <textarea className="tnp-input tnp-textarea" name="description"
              value={formData.description} onChange={handleChange} rows="4"
              placeholder="Describe the role, responsibilities, and what students can expect..." />
          </div>

          <div className="tnp-field">
            <label className="tnp-label">Eligibility criteria</label>
            <textarea className="tnp-input tnp-textarea" name="eligibilityCriteria"
              value={formData.eligibilityCriteria} onChange={handleChange} rows="3"
              placeholder="e.g. CGPA ≥ 7.0, CSE/IT branches, No active backlogs..." />
          </div>

          <div className="tnp-form-row">
            <div className="tnp-field">
              <label className="tnp-label">JD link</label>
              <input className="tnp-input" type="url" name="jdLink"
                value={formData.jdLink} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="tnp-field">
              <label className="tnp-label">Last date to apply</label>
              <input className="tnp-input" type="date" name="lastDate"
                value={formData.lastDate} onChange={handleChange} />
            </div>
          </div>

          <div className="tnp-field">
            <label className="tnp-label">
              Assign recruiters
              <span className="tnp-label-hint"> (hold Ctrl / Cmd to select multiple)</span>
            </label>
            <select
              className="tnp-input tnp-multi-select"
              multiple
              value={formData.recruiterIds}
              onChange={handleRecruiterSelect}
            >
              {recruiters.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {rec.name} — {rec.company}
                </option>
              ))}
            </select>
            {formData.recruiterIds.length > 0 && (
              <div className="tnp-selected-count">
                {formData.recruiterIds.length} recruiter{formData.recruiterIds.length > 1 ? "s" : ""} selected
              </div>
            )}
          </div>

          {message.text && (
            <div className={`tnp-message tnp-message--${message.type}`}>{message.text}</div>
          )}

          <button className="tnp-submit-btn" type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddJobs;