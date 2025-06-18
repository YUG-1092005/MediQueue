import React, { useState, useRef } from "react";
import {
  FaDesktop,
  FaMobileAlt,
  FaVideo,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./demo.css";

export const Demo = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const queueRef = useRef(null);
  const inventoryRef = useRef(null);

  const handleVideoPlay = (videoType) => {
    if (activeVideo === videoType) {
      setActiveVideo(null);
      return;
    }
    setActiveVideo(videoType);

    setTimeout(() => {
      if (videoType === "queue") {
        queueRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (videoType === "inventory") {
        inventoryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const handleVideoClose = () => setActiveVideo(null);

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
          {/* Show Queue Card or Queue Video */}
          {activeVideo === "queue" ? (
            <div ref={queueRef} className="demo-video-container">
              <div className="demo-video-header">
                <h4 className="demo-video-title">Queue Management Demo</h4>
                <button onClick={handleVideoClose} className="demo-video-close">
                  ×
                </button>
              </div>
              <video
                className="demo-video"
                src="/Queue_Video.mp4"
                autoPlay
                muted
                controls
                onEnded={handleVideoClose}
              />
            </div>
          ) : activeVideo === null || activeVideo === "inventory" ? (
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
                <button
                  style={{ outline: "none", border: "none" }}
                  onClick={() => handleVideoPlay("queue")}
                  className={`demo-button video-btn blue-btn ${
                    activeVideo === "queue" ? "active" : ""
                  }`}
                >
                  <FaVideo className="button-icon" />
                  Watch Demo Video
                </button>
              </div>
            </div>
          ) : null}

          {/* Show Inventory Card or Inventory Video */}
          {activeVideo === "inventory" ? (
            <div ref={inventoryRef} className="demo-video-container">
              <div className="demo-video-header">
                <h4 className="demo-video-title">Inventory Management Demo</h4>
                <button onClick={handleVideoClose} className="demo-video-close">
                  ×
                </button>
              </div>
              <video
                className="demo-video"
                src="/Inventory.mp4"
                autoPlay
                muted
                controls
                onEnded={handleVideoClose}
              />
            </div>
          ) : activeVideo === null || activeVideo === "queue" ? (
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
                <button
                  onClick={() => handleVideoPlay("inventory")}
                  style={{ outline: "none", border: "none" }}
                  className={`demo-button video-btn green-btn ${
                    activeVideo === "inventory" ? "active" : ""
                  }`}
                >
                  <FaVideo className="button-icon" />
                  Watch Demo Video
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
