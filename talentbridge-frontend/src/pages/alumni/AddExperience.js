import { useState } from "react";
import axios from "axios";

const DIFFICULTY_OPTIONS = [
  { value: "easy",   label: "Easy",   color: "#10B981" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "hard",   label: "Hard",   color: "#EF4444" },
];

function AddExperience() {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    roundsCount: "",
    experienceDescription: "",
    overallExperience: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDifficulty = (value) => {
    setFormData({ ...formData, overallExperience: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/alumni/experiences",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: "Experience shared successfully!", type: "success" });
      setFormData({ company: "", role: "", roundsCount: "", experienceDescription: "", overallExperience: "" });
    } catch (err) {
      setMessage({ text: "Failed to share experience. Please try again.", type: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-card">
      <div className="al-card-header">
        <div className="al-card-icon al-card-icon--indigo">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#A5B4FC" strokeWidth="1.4"/>
            <path d="M8 5v6M5 8h6" stroke="#A5B4FC" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h2 className="al-card-title">Share your interview experience</h2>
          <p className="al-card-sub">Help juniors prepare by sharing what you went through.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="al-form">

        <div className="al-form-row">
          <div className="al-field">
            <label className="al-label">Company <span className="al-required">*</span></label>
            <input
              className="al-input"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft"
              required
            />
          </div>

          <div className="al-field">
            <label className="al-label">Role</label>
            <input
              className="al-input"
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. SDE Intern"
            />
          </div>
        </div>

        <div className="al-field" style={{ maxWidth: 180 }}>
          <label className="al-label">Number of rounds</label>
          <input
            className="al-input"
            type="number"
            name="roundsCount"
            value={formData.roundsCount}
            onChange={handleChange}
            min="0"
            placeholder="e.g. 3"
          />
        </div>

        <div className="al-field">
          <label className="al-label">Overall difficulty</label>
          <div className="al-difficulty-tabs">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`al-difficulty-tab ${formData.overallExperience === opt.value ? "active" : ""}`}
                style={formData.overallExperience === opt.value ? { borderColor: opt.color, color: opt.color, background: opt.color + "18" } : {}}
                onClick={() => handleDifficulty(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="al-field">
          <label className="al-label">Experience description <span className="al-required">*</span></label>
          <textarea
            className="al-input al-textarea"
            name="experienceDescription"
            value={formData.experienceDescription}
            onChange={handleChange}
            rows="6"
            placeholder="Describe the interview process, rounds, questions asked, tips for future candidates..."
            required
          />
        </div>

        {message.text && (
          <div className={`al-message al-message--${message.type}`}>
            {message.text}
          </div>
        )}

        <button className="al-submit-btn" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Experience"}
        </button>

      </form>
    </div>
  );
}

export default AddExperience;