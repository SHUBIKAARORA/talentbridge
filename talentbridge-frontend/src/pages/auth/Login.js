import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { Link } from "react-router-dom";
import './auth.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">

      {/* ── Left panel ── */}
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
      <div className="auth-rhs">
        <div className="auth-form-wrap">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-sub">Sign in to your TalentBridge account</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="auth-submit" type="submit">
              Sign in
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;