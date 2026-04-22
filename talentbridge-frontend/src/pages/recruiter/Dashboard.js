import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../utils/logout";
import Profile from "./Profile";
import JobListing from "./JobListing";
import StudentApplication from "./StudentApplication";
import RecruiterSidebar from "./RecruiterSidebar";
import Navbar from "../student/Navbar";
import "../../styles/recruiter-dashboard.css";

const PAGE_TITLES = {
  profile:      "My Profile",
  jobs:         "Posted Jobs",
  applications: "Student Applications",
};

function Dashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId"));
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [highlightedApplicationId, setHighlightedApplicationId] = useState(null);

  const renderContent = () => {
    switch (activeSection) {
      case "profile":      return <Profile />;
      case "jobs":         return <JobListing selectedJobId={selectedJobId} />;
      case "applications": return <StudentApplication />;
      default:             return <Profile />;
    }
  };

  return (
    <div className="rc-shell">
      <RecruiterSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={() => logout(navigate)}
      />

      <div className="rc-main">
        <Navbar
          userId={userId}
          setActiveSection={setActiveSection}
          setSelectedJobId={setSelectedJobId}
          setHighlightedApplicationId={setHighlightedApplicationId}
        />

        <header className="rc-topbar">
          <div>
            <h1 className="rc-page-title">{PAGE_TITLES[activeSection]}</h1>
            <p className="rc-page-sub">Recruiter Portal · TalentBridge</p>
          </div>
        </header>

        <div className="rc-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;