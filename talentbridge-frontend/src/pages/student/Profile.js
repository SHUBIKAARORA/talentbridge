import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    rollNumber: "", department: "", year: "", cgpa: "", resumeLink: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [resumeMessage, setResumeMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setProfile(data);
        setFormData({
          rollNumber: data.rollNumber || "",
          department: data.department || "",
          year: data.year || "",
          cgpa: data.cgpa || "",
          resumeLink: data.resumeLink || "",
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
      await axios.put("http://localhost:8080/api/student/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch {
      setMessage({ text: "Failed to update profile.", type: "error" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setResumeMessage({ text: "", type: "" });
    } else {
      setResumeMessage({ text: "Please select a valid PDF file.", type: "error" });
      setResumeFile(null);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true);
    setResumeMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("file", resumeFile);
      await axios.post("http://localhost:8080/api/student/resume", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setResumeMessage({ text: "Resume uploaded successfully!", type: "success" });
      setResumeFile(null);
    } catch {
      setResumeMessage({ text: "Failed to upload resume. Please try again.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const dv = (v) => (v === null || v === undefined || v === "" ? "—" : v);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  if (loading) return <div className="st-loading">Loading profile...</div>;
  if (!profile) return <div className="st-loading">No profile data found.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 700 }}>

      {/* Identity card */}
      <div className="st-card st-profile-identity">
        <div className="st-avatar">{initials}</div>
        <div>
          <div className="st-profile-name">{dv(profile.name)}</div>
          <div className="st-profile-email">{dv(profile.email)}</div>
          <span className="st-role-badge">Student</span>
        </div>
      </div>

      {/* Academic details */}
      <div className="st-card">
        <div className="st-card-header">
          <div className="st-card-icon st-card-icon--indigo">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="#A5B4FC" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="st-card-title">Academic details</h2>
            <p className="st-card-sub">Keep your academic info up to date for better job matching.</p>
          </div>
        </div>

        <div className="st-form">
          <div className="st-form-row">
            <div className="st-field">
              <label className="st-label">Roll number</label>
              <input className="st-input" name="rollNumber" value={formData.rollNumber}
                onChange={handleChange} placeholder="e.g. 21CS001" />
            </div>
            <div className="st-field">
              <label className="st-label">Department</label>
              <input className="st-input" name="department" value={formData.department}
                onChange={handleChange} placeholder="e.g. Computer Science" />
            </div>
          </div>

          <div className="st-form-row">
            <div className="st-field">
              <label className="st-label">Year</label>
              <input className="st-input" name="year" value={formData.year}
                onChange={handleChange} placeholder="e.g. 3" />
            </div>
            <div className="st-field">
              <label className="st-label">CGPA</label>
              <input className="st-input" name="cgpa" value={formData.cgpa}
                onChange={handleChange} placeholder="e.g. 8.5" />
            </div>
          </div>

          {message.text && (
            <div className={`st-message st-message--${message.type}`}>{message.text}</div>
          )}

          <button className="st-submit-btn" onClick={handleUpdate}>Save changes</button>
        </div>
      </div>

      {/* Resume upload */}
      <div className="st-card">
        <div className="st-card-header">
          <div className="st-card-icon st-card-icon--sky">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 7l3 3 3-3" stroke="#38BDF8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 13h10" stroke="#38BDF8" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h2 className="st-card-title">Resume</h2>
            <p className="st-card-sub">Upload a PDF resume to improve your match score.</p>
          </div>
        </div>

        <div className="st-form">
          {formData.resumeLink && (
            <div className="st-resume-existing">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="#10B981" strokeWidth="1.4"/>
                <path d="M5 8l2 2 4-4" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Resume already uploaded
            </div>
          )}

          <div className="st-field">
            <label className="st-label">Select PDF file</label>
            <input
              className="st-file-input"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div>

          {resumeFile && (
            <div className="st-file-selected">
              Selected: {resumeFile.name}
            </div>
          )}

          {resumeMessage.text && (
            <div className={`st-message st-message--${resumeMessage.type}`}>{resumeMessage.text}</div>
          )}

          <button
            className="st-submit-btn"
            onClick={handleResumeUpload}
            disabled={!resumeFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      </div>

    </div>
  );
}

export default Profile;