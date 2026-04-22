import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ company: "", designation: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/recruiter/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setProfile(data);
        setFormData({
          company: data.company === "Not Updated" ? "" : data.company || "",
          designation: data.designation || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8080/api/recruiter/profile", formData, {
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
    : "RC";

  if (loading) return <div className="rc-loading">Loading profile...</div>;
  if (!profile) return <div className="rc-loading">No profile data found.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 680 }}>

      {/* Identity card */}
      <div className="rc-card rc-profile-identity">
        <div className="rc-avatar">{initials}</div>
        <div>
          <div className="rc-profile-name">{dv(profile.name)}</div>
          <div className="rc-profile-email">{dv(profile.email)}</div>
          <span className="rc-role-badge">Recruiter</span>
        </div>
      </div>

      {/* Editable fields */}
      <div className="rc-card">
        <div className="rc-card-header">
          <div className="rc-card-icon rc-card-icon--sky">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="#38BDF8" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="rc-card-title">Company details</h2>
            <p className="rc-card-sub">Update your recruiter information.</p>
          </div>
        </div>

        <div className="rc-form">
          <div className="rc-form-row">
            <div className="rc-field">
              <label className="rc-label">Company</label>
              <input className="rc-input" name="company" value={formData.company}
                onChange={handleChange} placeholder="e.g. Google" />
            </div>
            <div className="rc-field">
              <label className="rc-label">Designation</label>
              <input className="rc-input" name="designation" value={formData.designation}
                onChange={handleChange} placeholder="e.g. HR Manager" />
            </div>
          </div>

          {message.text && (
            <div className={`rc-message rc-message--${message.type}`}>{message.text}</div>
          )}

          <button className="rc-submit-btn" onClick={handleUpdate}>Save changes</button>
        </div>
      </div>

    </div>
  );
}

export default Profile;