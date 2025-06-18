// Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AppSidebar } from "./appsidebar";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./navbar.css";

export const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Clinics", href: "/api/list/clinic" },
    { name: "About", href: "/about" },
    { name: "Features", href: "#features" },
    { name: "Contact", href: "#contact" },
  ];

  const location = useLocation();

  // Handle navigation click
  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();

      const targetId = href.substring(1);
      const el = document.getElementById(targetId);

      if (location.pathname === "/") {
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/");

        setTimeout(() => {
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }, 500);
      }
    } else {
      navigate(href);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_SERVER_URL}/user/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log("LOG OUT DATA", data);
      if (data.success === true) {
        setIsAuthenticated(false);
        navigate("/", { state: { message: data.message } });
      } else {
        console.log("error in log out");
        toast.error("Logout failed. Please try again.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.log("Logout Error:", error);
      toast.error("An error occurred during logout. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            MediQueue
          </Link>

          <div className="nav-links">
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="nav-link"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.name}
                </a>
              ) : (
                <Link key={item.name} to={item.href} className="nav-link">
                  {item.name}
                </Link>
              )
            )}
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <Link className="nav-logout" onClick={logout} to="/">
                LogOut
              </Link>
            ) : (
              <>
                <Link to="/login" className="nav-login">
                  Login
                </Link>
                <Link to="/signup" className="nav-signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="hamburger" onClick={() => setIsOpen(true)}>
            <FaBars size={20} />
          </button>
        </div>
      </nav>

      {isOpen && (
        <>
          <div className="sidebar-overlay open">
            <div className="sidebar-header">
              <h2>MediQueue</h2>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <FaTimes size={20} />
              </button>
            </div>
<AppSidebar
  onClose={() => setIsOpen(false)}
  isAuthenticated={isAuthenticated}
  logout={logout}
/>
            <ToastContainer />
          </div>

          <div className="backdrop" onClick={() => setIsOpen(false)} />
        </>
      )}
    </>
  );
};
