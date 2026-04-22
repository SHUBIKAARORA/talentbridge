import '../../styles/tnp-dashboard.css';

const NAV_ITEMS = [
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
    key: "addjobs",
    label: "Post a Job",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "applications",
    label: "Applications",
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
  {
    key: "analytics",
    label: "Analytics",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 13V8M6 13V5M10 13V7M14 13V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function TnpSidebar({ activeSection, setActiveSection, onLogout }) {
  return (
    <aside className="tnp-sidebar">
      <div className="tnp-sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="9" fill="#6366F1"/>
          <rect x="9" y="20" width="4" height="10" rx="1" fill="white"/>
          <rect x="23" y="20" width="4" height="10" rx="1" fill="white"/>
          <path d="M9 22 Q18 10 27 22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <rect x="7" y="26" width="22" height="2.5" rx="1" fill="white" opacity="0.55"/>
        </svg>
        <span className="tnp-sidebar-logo-text">Talent<span>Bridge</span></span>
      </div>

      <div className="tnp-sidebar-section-label">T&amp;P Cell</div>

      <nav className="tnp-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`tnp-nav-item ${activeSection === item.key ? "active" : ""}`}
            onClick={() => setActiveSection(item.key)}
          >
            <span className="tnp-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="tnp-logout-btn" onClick={onLogout}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Log out
      </button>
    </aside>
  );
}

export default TnpSidebar;