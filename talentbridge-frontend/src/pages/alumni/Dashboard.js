import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlumniSidebar from "./AlumniSidebar";
import AddExperience from "./AddExperience";
import ExperienceList from "./ExperienceList";
import AlumniProfile from "./AlumniProfile";
import { logout } from "../../utils/logout";
import "../../styles/alumni-dashboard.css";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("add");
  const navigate = useNavigate();

  const PAGE_TITLES = {
    add: "Share an Experience",
    view: "Browse Experiences",
    profile: "My Profile",
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile": return <AlumniProfile />;
      case "add":     return <AddExperience />;
      case "view":    return <ExperienceList />;
      default:        return <AddExperience />;
    }
  };

  return (
    <div className="al-shell">
      <AlumniSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={() => logout(navigate)}
      />

      <main className="al-main">
        <header className="al-topbar">
          <div>
            <h1 className="al-page-title">{PAGE_TITLES[activeSection]}</h1>
            <p className="al-page-sub">Alumni Portal · TalentBridge</p>
          </div>
        </header>

        <div className="al-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;