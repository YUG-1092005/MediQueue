import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Home from "./Homepage/home";
import Signup from "./Credentials/Signup/signup";
import Login from "./Credentials/Login/login";
import Queue from "./QueueManagement/queue";
import Clinics from "./Clinics/clinics";
// import Ngo from "./Ngos/ngo";
import About from "./About/about";
import Manage from "./ManageMembers/manage";
import InviteSignup from "./InviteSignup/invite_signup";
import DoctorDashboard from "./DoctorDashboard/dashboard";
import Inventory from "./Inventory/inventory";
import EditClinic from "./Clinics/EditClinic/edit";

const AppRoutes = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "PUSH" || navigationType === "POP") {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location, navigationType]);

  return (
    <div>
      {loading ? (
        <div className="loader-wrapper">
          <video
            autoPlay
            loop
            muted
            className="loader-video"
            onLoadedData={(e) => {
              e.target.playbackRate = 2.0;
            }}
          >
            <source src="/loader.webm" type="video/webm" />
          </video>
        </div>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/signup"
              element={<Signup setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/queue-management" element={<Queue />} />
            <Route path="/api/list/clinic" element={<Clinics />} />
            <Route path="/clinics/:clinicId/edit" element={<EditClinic />} />
            {/* <Route path="/api/listings/ngo" element={<Ngo />} /> */}
            <Route path="/:clinicId/manage/members" element={<Manage />} />
            <Route
              path="/invite/:clinicId/:inviteId"
              element={<InviteSignup />}
            />
            <Route path="/:clinicId/dashboard" element={<DoctorDashboard />} />
            <Route path="/inventory-management" element={<Inventory />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default AppRoutes;
