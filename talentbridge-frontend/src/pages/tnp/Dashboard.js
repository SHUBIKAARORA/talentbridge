import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../utils/logout";
import JobListing from "./JobListing";
import StudentApplication from "./StudentApplication";
import AlumniExperience from "./AlumniExperience";
import Analysis from "./Analysis";
import AddJobs from "./AddJobs";
import TnpSidebar from "./TnpSidebar";
import '../../styles/tnp-dashboard.css';

const PAGE_TITLES = {
  jobs:         "Job Listings",
  addjobs:      "Post a Job",
  applications: "Student Applications",
  alumni:       "Alumni Experiences",
  analytics:    "Analytics",
};

function Dashboard() {
  const [activeSection, setActiveSection] = useState("jobs");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeSection) {
      case "jobs":         return <JobListing setActiveSection={setActiveSection} setSelectedJobId={setSelectedJobId} />;
      case "addjobs":      return <AddJobs />;
      case "applications": return <StudentApplication jobId={selectedJobId} setActiveSection={setActiveSection} />;
      case "alumni":       return <AlumniExperience />;
      case "analytics":    return <Analysis />;
      default:             return <JobListing setActiveSection={setActiveSection} setSelectedJobId={setSelectedJobId} />;
    }
  };

  return (
    <div className="tnp-shell">
      <TnpSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={() => logout(navigate)}
      />

      <div className="tnp-main">
        <header className="tnp-topbar">
          <div>
            <h1 className="tnp-page-title">{PAGE_TITLES[activeSection]}</h1>
            <p className="tnp-page-sub">Training &amp; Placement Cell · TalentBridge</p>
          </div>
        </header>

        <div className="tnp-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;