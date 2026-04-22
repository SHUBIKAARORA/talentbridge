import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import { logout } from "../../utils/logout";
import JobListing from "./JobListing";
import ApplicationStatus from "./ApplicationStatus";
import Profile from "./Profile";
import Alumni from "./Alumni";
import Navbar from "./Navbar";
import "../../styles/student-dashboard.css";

const PAGE_TITLES = {
  profile:      "My Profile",
  jobs:         "Job Listings",
  applications: "My Applications",
  alumni:       "Alumni Experiences",
};

function Dashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [highlightedApplicationId, setHighlightedApplicationId] = useState(null);
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId"));

  const renderContent = () => {
    switch (activeSection) {
      case "profile":      return <Profile />;
      case "jobs":         return <JobListing selectedJobId={selectedJobId} />;
      case "applications": return (
        <ApplicationStatus
          setActiveSection={setActiveSection}
          setSelectedJobId={setSelectedJobId}
          highlightedApplicationId={highlightedApplicationId}
        />
      );
      case "alumni":       return <Alumni />;
      default:             return <Profile />;
    }
  };

  return (
    <div className="st-shell">
      <StudentSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={() => logout(navigate)}
      />

      <div className="st-main">
        <Navbar
          userId={userId}
          setActiveSection={setActiveSection}
          setSelectedJobId={setSelectedJobId}
          setHighlightedApplicationId={setHighlightedApplicationId}
        />

        <header className="st-topbar">
          <div>
            <h1 className="st-page-title">{PAGE_TITLES[activeSection]}</h1>
            <p className="st-page-sub">Student Portal · TalentBridge</p>
          </div>
        </header>

        <div className="st-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;