import { useEffect, useState } from "react";
import axios from "axios";

const DIFFICULTY_STYLES = {
  easy:   { bg: "#D1FAE5", color: "#065F46", label: "Easy" },
  medium: { bg: "#FEF3C7", color: "#92400E", label: "Medium" },
  hard:   { bg: "#FEE2E2", color: "#991B1B", label: "Hard" },
};

function ExperienceList() {
  const [experiences, setExperiences] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchExperiences = async (company = "") => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:8080/api/alumni/experiences", {
        headers: { Authorization: `Bearer ${token}` },
        params: company ? { company } : {},
      });
      setExperiences(response.data);
    } catch {
      setError("Failed to load experiences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperiences(); }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchExperiences(value);
  };

  const dv = (v) => (v === null || v === undefined || v === "" ? "—" : v);

  const diffStyle = (val) => DIFFICULTY_STYLES[val?.toLowerCase()] || null;

  return (
    <div className="al-exp-list">

      {/* Search bar */}
      <div className="al-search-row">
        <div className="al-search-wrap">
          <svg className="al-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="#94A3B8" strokeWidth="1.4"/>
            <path d="M10 10l3 3" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            className="al-search-input"
            type="text"
            placeholder="Search by company..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {!loading && (
          <span className="al-result-count">
            {experiences.length} {experiences.length === 1 ? "result" : "results"}
          </span>
        )}
      </div>

      {/* States */}
      {loading && <div className="al-loading">Loading experiences...</div>}
      {error && <div className="al-message al-message--error">{error}</div>}
      {!loading && !error && experiences.length === 0 && (
        <div className="al-empty">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#CBD5E1" strokeWidth="1.5"/>
            <path d="M14 26c0-3 2.7-5 6-5s6 2 6 5" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="20" cy="16" r="4" stroke="#CBD5E1" strokeWidth="1.5"/>
          </svg>
          <p>No experiences found{searchTerm ? ` for "${searchTerm}"` : ""}.</p>
        </div>
      )}

      {/* Cards */}
      {experiences.map((exp) => {
        const diff = diffStyle(exp.overallExperience);
        const initials = exp.alumniName
          ? exp.alumniName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
          : "AL";

        return (
          <div key={exp.experienceId} className="al-exp-card">

            {/* Card header */}
            <div className="al-exp-card-header">
              <div>
                <div className="al-exp-company">{dv(exp.company)}</div>
                <div className="al-exp-role">{dv(exp.role)}</div>
              </div>
              <div className="al-exp-badges">
                {exp.roundsCount && (
                  <span className="al-badge al-badge--gray">
                    {exp.roundsCount} {exp.roundsCount === 1 ? "round" : "rounds"}
                  </span>
                )}
                {diff && (
                  <span className="al-badge" style={{ background: diff.bg, color: diff.color }}>
                    {diff.label}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="al-exp-desc">{dv(exp.experienceDescription)}</p>

            {/* Divider */}
            <div className="al-exp-divider" />

            {/* Alumni info */}
            <div className="al-exp-footer">
              <div className="al-mini-avatar">{initials}</div>
              <div>
                <div className="al-exp-alumni-name">{dv(exp.alumniName)}</div>
                <div className="al-exp-alumni-meta">
                  {dv(exp.designation)}{exp.currentCompany && exp.currentCompany !== "—" ? ` · ${exp.currentCompany}` : ""}
                </div>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default ExperienceList;