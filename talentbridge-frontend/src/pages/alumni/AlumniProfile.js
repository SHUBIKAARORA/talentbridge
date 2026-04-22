import { useEffect, useState } from "react";
import axios from "axios";

function AlumniProfile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ company: "", designation: "", experienceYears: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/alumni/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setProfile(data);
        setFormData({
          company: data.company || "",
          designation: data.designation || "",
          experienceYears: data.experienceYears || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8080/api/alumni/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: "Failed to update profile.", type: "error" });
      console.error(err);
    }
  };

  const dv = (v) => (v === null || v === undefined || v === "" ? "—" : v);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AL";

  if (loading) return <div className="al-loading">Loading profile...</div>;
  if (!profile) return <div className="al-loading">No profile data found.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 680 }}>

      {/* Identity card */}
      <div className="al-card al-profile-identity">
        <div className="al-avatar">{initials}</div>
        <div>
          <div className="al-profile-name">{dv(profile.name)}</div>
          <div className="al-profile-email">{dv(profile.email)}</div>
          <span className="al-role-badge">Alumni</span>
        </div>
      </div>

      {/* Editable fields */}
      <div className="al-card">
        <div className="al-card-header">
          <div className="al-card-icon al-card-icon--sky">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="#38BDF8" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="al-card-title">Professional details</h2>
            <p className="al-card-sub">Update your current work information.</p>
          </div>
        </div>

        <div className="al-form" style={{ marginTop: "1.25rem" }}>
          <div className="al-form-row">
            <div className="al-field">
              <label className="al-label">Current company</label>
              <input className="al-input" name="company" value={formData.company}
                onChange={handleChange} placeholder="e.g. Google" />
            </div>
            <div className="al-field">
              <label className="al-label">Designation</label>
              <input className="al-input" name="designation" value={formData.designation}
                onChange={handleChange} placeholder="e.g. Senior SDE" />
            </div>
          </div>

          <div className="al-field" style={{ maxWidth: 200 }}>
            <label className="al-label">Years of experience</label>
            <input className="al-input" type="number" name="experienceYears"
              value={formData.experienceYears} onChange={handleChange} min="0" placeholder="e.g. 4" />
          </div>

          {message.text && (
            <div className={`al-message al-message--${message.type}`}>{message.text}</div>
          )}

          <button className="al-submit-btn" onClick={handleUpdate}>
            Save changes
          </button>
        </div>
      </div>

    </div>
  );
}

export default AlumniProfile;