import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { Link } from "react-router-dom";
import './auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    rollNumber: "",
    department: "",
    year: "",
    cgpa: "",
    resumeLink: "",
    company: "",
    designation: "",
    experienceYears: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await registerUser(formData);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  const roles = [
    { value: "student",   label: "Student" },
    { value: "alumni",    label: "Alumni" },
    { value: "recruiter", label: "Recruiter" },
    { value: "admin",     label: "T&P Cell" },
  ];

  return (
    <div className="auth-page">

      {/* ── Left panel (same as Login) ── */}
      <div className="auth-lhs">
        <div className="auth-logo">
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="9" fill="#6366F1"/>
            <rect x="9" y="20" width="4" height="10" rx="1" fill="white"/>
            <rect x="23" y="20" width="4" height="10" rx="1" fill="white"/>
            <path d="M9 22 Q18 10 27 22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            <rect x="7" y="26" width="22" height="2.5" rx="1" fill="white" opacity="0.55"/>
          </svg>
          <span className="auth-logo-text">Talent<span>Bridge</span></span>
        </div>

        <div className="auth-lhs-body">
          <div className="auth-season-tag">
            <span className="auth-season-dot" />
            2025-26 Placement Season Open
          </div>
          <h1 className="auth-headline">
            Your career journey<br />starts <span>here.</span>
          </h1>
          <p className="auth-lhs-sub">
            Connecting students, recruiters, and alumni through one unified placement platform.
          </p>

          <div className="auth-feats">
            <div className="auth-feat">
              <div className="auth-feat-icon auth-feat-icon--indigo">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="#A5B4FC" strokeWidth="1.5" />
                  <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="#A5B4FC"
                    strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="auth-feat-title">For students</div>
                <div className="auth-feat-sub">Browse jobs, track applications, build your profile</div>
              </div>
            </div>

            <div className="auth-feat">
              <div className="auth-feat-icon auth-feat-icon--sky">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="9" rx="2" stroke="#38BDF8" strokeWidth="1.5" />
                  <path d="M5 7h6M5 10h4" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="auth-feat-title">For recruiters</div>
                <div className="auth-feat-sub">Post openings, shortlist candidates, schedule drives</div>
              </div>
            </div>

            <div className="auth-feat">
              <div className="auth-feat-icon auth-feat-icon--emerald">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L10 6h4l-3 2.5 1 4L8 10l-4 2.5 1-4L2 6h4z"
                    stroke="#10B981" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="auth-feat-title">For alumni</div>
                <div className="auth-feat-sub">Mentor juniors, refer opportunities, stay connected</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-stats">
          <div className="auth-stat">
            <div className="auth-stat-val">1,240+</div>
            <div className="auth-stat-lbl">Active students</div>
          </div>
          <div className="auth-stat">
            <div className="auth-stat-val">380</div>
            <div className="auth-stat-lbl">Companies</div>
          </div>
          <div className="auth-stat">
            <div className="auth-stat-val">94%</div>
            <div className="auth-stat-lbl">Placement rate</div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-rhs auth-rhs--scroll">
        <div className="auth-form-wrap">
          <h2 className="auth-form-title">Create an account</h2>
          <p className="auth-form-sub">Join TalentBridge to get started</p>

          {/* Role selector */}
          <div className="auth-role-tabs">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`auth-role-tab ${formData.role === r.value ? "active" : ""}`}
                onClick={() => handleRoleChange(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister}>

            {/* Basic info */}
            <div className="auth-section-label">Basic info</div>

            <div className="auth-field">
              <label className="auth-label">Full name</label>
              <input className="auth-input" type="text" name="name"
                placeholder="Your name" onChange={handleChange} required />
            </div>

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input className="auth-input" type="email" name="email"
                placeholder="you@college.edu" onChange={handleChange} required />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input className="auth-input" type="password" name="password"
                placeholder="••••••••" onChange={handleChange} required />
            </div>

            {/* Student fields */}
            {formData.role === "student" && (
              <>
                <div className="auth-section-label">Student details</div>
                <div className="auth-field">
                  <label className="auth-label">Roll number</label>
                  <input className="auth-input" type="text" name="rollNumber"
                    placeholder="e.g. 21CS001" onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Department</label>
                  <input className="auth-input" type="text" name="department"
                    placeholder="e.g. Computer Science" onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Year</label>
                  <input className="auth-input" type="number" name="year"
                    placeholder="e.g. 3" onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">CGPA</label>
                  <input className="auth-input" type="number" name="cgpa"
                    placeholder="e.g. 8.5" step="0.01" onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Resume link <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span></label>
                  <input className="auth-input" type="url" name="resumeLink"
                    placeholder="https://drive.google.com/..." onChange={handleChange} />
                </div>
              </>
            )}

            {/* Alumni fields */}
            {formData.role === "alumni" && (
              <>
                <div className="auth-section-label">Alumni details</div>
                <div className="auth-field">
                  <label className="auth-label">Company</label>
                  <input className="auth-input" type="text" name="company"
                    placeholder="Current employer" onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Designation</label>
                  <input className="auth-input" type="text" name="designation"
                    placeholder="Your role" onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Years of experience</label>
                  <input className="auth-input" type="number" name="experienceYears"
                    placeholder="e.g. 4" onChange={handleChange} />
                </div>
              </>
            )}

            {/* Recruiter fields */}
            {formData.role === "recruiter" && (
              <>
                <div className="auth-section-label">Recruiter details</div>
                <div className="auth-field">
                  <label className="auth-label">Company</label>
                  <input className="auth-input" type="text" name="company"
                    placeholder="Company name" onChange={handleChange} required />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Designation</label>
                  <input className="auth-input" type="text" name="designation"
                    placeholder="Your role" onChange={handleChange} />
                </div>
              </>
            )}

            {/* T&P — no extra fields */}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Register;