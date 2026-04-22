import '../../styles/student-dashboard.css';

const NAV_ITEMS = [
  {
    key: "profile",
    label: "My Profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "jobs",
    label: "Job Listings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "applications",
    label: "My Applications",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "alumni",
    label: "Alumni Experiences",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L10 6h4l-3 2.5 1 4L8 10l-4 2.5 1-4L2 6h4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

function StudentSidebar({ activeSection, setActiveSection, onLogout }) {
  return (
    <aside className="st-sidebar">
      <div className="st-sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="9" fill="#6366F1"/>
          <rect x="9" y="20" width="4" height="10" rx="1" fill="white"/>
          <rect x="23" y="20" width="4" height="10" rx="1" fill="white"/>
          <path d="M9 22 Q18 10 27 22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <rect x="7" y="26" width="22" height="2.5" rx="1" fill="white" opacity="0.55"/>
        </svg>
        <span className="st-sidebar-logo-text">Talent<span>Bridge</span></span>
      </div>

      <div className="st-sidebar-section-label">Student Portal</div>

      <nav className="st-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`st-nav-item ${activeSection === item.key ? "active" : ""}`}
            onClick={() => setActiveSection(item.key)}
          >
            <span className="st-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="st-logout-btn" onClick={onLogout}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Log out
      </button>
    </aside>
  );
}

export default StudentSidebar;