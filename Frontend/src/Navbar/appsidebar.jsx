// import React from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   FaHome,
//   FaUsers,
//   FaBox,
//   FaSignInAlt,
//   FaUserPlus,
// } from "react-icons/fa";
// import "./appsidebar.css";

// export const AppSidebar = ({ onClose }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isHomePage = location.pathname === "/";

//   const navItems = [
//     { name: "Home", href: "/", icon: FaHome },
//     { name: "Clinics", href: "/api/list/clinic", icon: FaUsers },
//     { name: "About", href: "#about", icon: FaBox },
//     { name: "Features", href: "#features", icon: FaBox },
//     { name: "Contact", href: "#contact", icon: FaBox },
//   ];

//   const authItems = [
//     { name: "Login", href: "/login", icon: FaSignInAlt },
//     { name: "Sign Up", href: "/signup", icon: FaUserPlus },
//   ];

//   // Scroll to section helper function
//   const scrollToSection = (id) => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth" });
//       if (onClose) onClose();
//     }
//   };

//   // Handle navigation click
//   const handleNavClick = (e, href) => {
//     if (href.startsWith("#")) {
//       e.preventDefault();
//       const sectionId = href.slice(1);

//       if (isHomePage) {
//         scrollToSection(sectionId);
//       } else {
//         navigate("/");
//         setTimeout(() => scrollToSection(sectionId), 500);
//       }
//     } else {
//       if (onClose) onClose();
//       navigate(href);
//     }
//   };

//   return (
//     <div className="sidebar">
//       <div className="sidebar-content">
//         <div className="sidebar-section">
//           <h3 className="sidebar-title">Navigation</h3>
//           <div className="sidebar-links">
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 className={`sidebar-link ${
//                   location.pathname === item.href ? "active" : ""
//                 }`}
//                 onClick={(e) => handleNavClick(e, item.href)}
//               >
//                 <item.icon className="sidebar-icon" />
//                 <span>{item.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="sidebar-section">
//           <h3 className="sidebar-title">Account</h3>
//           <div className="sidebar-links">
//             {authItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`sidebar-link ${
//                   location.pathname === item.href ? "active" : ""
//                 }`}
//                 onClick={onClose}
//               >
//                 <item.icon className="sidebar-icon" />
//                 <span>{item.name}</span>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBox,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import "./appsidebar.css";
export const AppSidebar = ({ onClose, isAuthenticated, logout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const navItems = [
    { name: "Home", href: "/", icon: FaHome },
    { name: "Clinics", href: "/api/list/clinic", icon: FaUsers },
    { name: "About", href: "#about", icon: FaBox },
    { name: "Features", href: "#features", icon: FaBox },
    { name: "Contact", href: "#contact", icon: FaBox },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (onClose) onClose();
    }
  };

  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const sectionId = href.slice(1);
      if (isHomePage) {
        scrollToSection(sectionId);
      } else {
        navigate("/");
        setTimeout(() => scrollToSection(sectionId), 500);
      }
    } else {
      if (onClose) onClose();
      navigate(href);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Navigation</h3>
          <div className="sidebar-links">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`sidebar-link ${
                  location.pathname === item.href ? "active" : ""
                }`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                <item.icon className="sidebar-icon" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Account</h3>
          <div className="sidebar-links">
            {isAuthenticated ? (
              <button
                className="sidebar-link"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                <FaSignInAlt className="sidebar-icon" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`sidebar-link ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                  onClick={onClose}
                >
                  <FaSignInAlt className="sidebar-icon" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className={`sidebar-link ${
                    location.pathname === "/signup" ? "active" : ""
                  }`}
                  onClick={onClose}
                >
                  <FaUserPlus className="sidebar-icon" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
