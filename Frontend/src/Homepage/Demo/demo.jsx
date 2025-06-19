import React from "react";
import { FaDesktop, FaMobileAlt, FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./demo.css";

export const Demo = () => {
  return (
    <section id="demo" className="demo-section">
      <div className="demo-container">
        <div className="demo-header">
          <h2 className="demo-title">See Our Platform in Action</h2>
          <p className="demo-subtitle">
            Experience how our solutions work in real healthcare environments
          </p>
        </div>

        <div className="demo-grid">
          {/* Queue Management Card */}
          <div className="demo-card">
            <div className="demo-card-header">
              <FaDesktop className="demo-icon blue-icon" />
              <h3 className="demo-card-title">Queue Management Dashboard</h3>
            </div>
            <div className="demo-info-box blue-gradient">
              <div className="info-row">
                <span className="info-label">Current Queue: Cardiology</span>
                <span className="info-value blue-text">12 patients</span>
              </div>
              <div className="info-row">
                <span className="info-label">Average Wait Time</span>
                <span className="info-value green-text">18 minutes</span>
              </div>
              <div className="info-row">
                <span className="info-label">Next Patient: John Doe</span>
                <span className="info-value orange-text">Token #A-043</span>
              </div>
            </div>
            <div className="demo-button-container">
              <Link
                to="https://drive.google.com/file/d/10JHt2bX-ToT8s7weUu1o70hkhlrHRTbQ/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="demo-button video-btn blue-btn"
              >
                <FaVideo className="button-icon" />
                Watch Demo Video
              </Link>
            </div>
          </div>

          {/* Inventory Tracking Card */}
          <div className="demo-card">
            <div className="demo-card-header">
              <FaMobileAlt className="demo-icon green-icon" />
              <h3 className="demo-card-title">Inventory Tracking System</h3>
            </div>
            <div className="demo-info-box green-gradient">
              <div className="info-row">
                <span className="info-label">Items Expiring Soon</span>
                <span className="info-value red-text">7 items</span>
              </div>
              <div className="info-row">
                <span className="info-label">Available for Sharing</span>
                <span className="info-value blue-text">23 items</span>
              </div>
              <div className="info-row">
                <span className="info-label">Donations This Month</span>
                <span className="info-value green-text">$15,240</span>
              </div>
            </div>
            <div className="demo-button-container">
              <Link
                to="https://drive.google.com/file/d/1sUCLon7XOnJ8l2dtD0vtqTkqVn3EEZRo/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="demo-button video-btn green-btn"
              >
                <FaVideo className="button-icon" />
                Watch Demo Video
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
