import React, { useState } from "react";
import {
  FaClock,
  FaBox,
  FaBell,
  FaChartBar,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import "./features.css";

export const Features = () => {
  const [activeTab, setActiveTab] = useState("queue");

  const queueFeatures = [
    {
      icon: FaClock,
      title: "Digital Queue Check-in",
      description:
        "Simple registration with name, department, and automatic token generation",
    },
    {
      icon: FaUsers,
      title: "Live Queue Tracking",
      description:
        "Real-time visibility of queue position and how many patients are ahead",
    },
    {
      icon: FaBell,
      title: "Smart Notifications",
      description:
        "Email, SMS, and WhatsApp alerts for queue updates and appointment reminders",
    },
    {
      icon: FaChartBar,
      title: "Admin Analytics",
      description:
        "Comprehensive dashboard with wait time analytics and peak hour insights",
    },
  ];

  const inventoryFeatures = [
    {
      icon: FaBox,
      title: "Smart Inventory Dashboard",
      description:
        "Track stock levels, expiry dates, and batch information in real-time",
    },
    {
      icon: FaBell,
      title: "Expiry Alerts",
      description:
        "Automated notifications for items approaching expiration dates",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Sharing Network (Coming Soon)",
      description:
        "Connect with nearby facilities to share excess inventory and reduce waste",
    },
    {
      icon: FaChartBar,
      title: "Impact Analytics",
      description:
        "Track waste reduction, donation impact, and inventory optimization metrics",
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="feature-container">
        <div className="features-header">
          <h2 className="features-title">
            Powerful Features for Modern Healthcare
          </h2>
          <p className="features-subtitle">
            Explore the comprehensive features that make our platform the
            complete solution for healthcare efficiency and waste reduction
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <div className="tabs-wrapper">
            <button
              onClick={() => setActiveTab("queue")}
              className={`tab-btn ${
                activeTab === "queue" ? "active blue" : "inactive"
              }`}
            >
              Queue Management
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`tab-btn ${
                activeTab === "inventory" ? "active green" : "inactive"
              }`}
            >
              Inventory Management
            </button>
          </div>
        </div>

        <div className="features-grid">
          {(activeTab === "queue" ? queueFeatures : inventoryFeatures).map(
            (feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="feature-card">
                  <div
                    className={`icon-circle ${
                      activeTab === "queue" ? "blue-bg" : "green-bg"
                    }`}
                  >
                    <Icon
                      className={`feature-icon ${
                        activeTab === "queue" ? "blue-icon" : "green-icon"
                      }`}
                    />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.description}</p>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};
