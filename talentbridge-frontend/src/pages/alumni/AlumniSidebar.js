import '../../styles/alumni-dashboard.css';

const NAV_ITEMS = [
  {
    key: "add",
    label: "Share Experience",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "view",
    label: "Browse Experiences",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="2" y="7.5" width="8" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="2" y="12" width="10" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
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
];

function AlumniSidebar({ activeSection, setActiveSection, onLogout }) {
  return (
    <aside className="al-sidebar">
      {/* Logo */}
      <div className="al-sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="9" fill="#6366F1"/>
          <rect x="9" y="20" width="4" height="10" rx="1" fill="white"/>
          <rect x="23" y="20" width="4" height="10" rx="1" fill="white"/>
          <path d="M9 22 Q18 10 27 22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <rect x="7" y="26" width="22" height="2.5" rx="1" fill="white" opacity="0.55"/>
        </svg>
        <span className="al-sidebar-logo-text">Talent<span>Bridge</span></span>
      </div>

      {/* Section label */}
      <div className="al-sidebar-section-label">Alumni Portal</div>

      {/* Nav */}
      <nav className="al-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`al-nav-item ${activeSection === item.key ? "active" : ""}`}
            onClick={() => setActiveSection(item.key)}
          >
            <span className="al-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button className="al-logout-btn" onClick={onLogout}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Log out
      </button>
    </aside>
  );
}

export default AlumniSidebar;