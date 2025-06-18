import React from "react";
import "./footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-about col-span-2">
            <h3 className="footer-title">MediQueue</h3>
            <p className="footer-text">
              Revolutionizing healthcare with intelligent queue management and
              medical inventory optimization. Smart Health. Zero Waste.
            </p>
            <div className="footer-heartline">
              <span>Made with</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="footer-heart"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                width="16"
                height="16"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                         4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                         14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                         6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              <span>for better healthcare</span>
            </div>
          </div>

          <div>
            <h4 className="footer-subtitle">Solutions</h4>
            <ul className="footer-list">
              <li>
                <a className="footer-link">Queue Management</a>
              </li>
              <li>
                <a className="footer-link">Inventory Optimization</a>
              </li>
              <li>
                <a className="footer-link">Analytics Dashboard</a>
              </li>
              <li>
                <a className="footer-link">Mobile Apps</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-subtitle">Company</h4>
            <ul className="footer-list">
              <li>
                <a className="footer-link">About Us</a>
              </li>
              <li>
                <a className="footer-link">Contact</a>
              </li>
              <li>
                <a className="footer-link">Privacy Policy</a>
              </li>
              <li>
                <a className="footer-link">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MediQueue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
