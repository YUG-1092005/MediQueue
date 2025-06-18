import React from 'react';
import { FiClock, FiUsers, FiPackage, FiActivity } from 'react-icons/fi';
import "./overview.css"

export const Overview = () => {
  return (
    <section id="products" className="products-section">
      <div className="overview-container">
        <div className="text-center section-header">
          <h2 className="section-title">Two Powerful Solutions, One Vision</h2>
          <p className="section-subtitle">
            Our integrated platform addresses the most pressing challenges in modern healthcare
          </p>
        </div>

        <div className="grid-container">
          {/* OPD Queue Management */}
          <div className="card blue-card">
            <div className="card-header">
              <div className="icon-wrapper blue-bg">
                <FiClock size={32} color="white" />
              </div>
              <h3 className="card-title">Smart OPD Queue Management</h3>
            </div>
            <p className="card-description">
              Eliminate patient waiting anxiety with real-time queue tracking, accurate ETAs, 
              and smart notifications. Transform the hospitals/clinics visit experience.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <FiUsers className="icon blue" />
                <span>Digital check-in & live tracking</span>
              </div>
              <div className="feature-item">
                <FiClock className="icon blue" />
                <span>Accurate wait time estimates</span>
              </div>
              <div className="feature-item">
                <FiActivity className="icon blue" />
                <span>Doctor availability schedules in near future</span>
              </div>
            </div>
          </div>

          {/* Inventory Management */}
          <div className="card green-card">
            <div className="card-header">
              <div className="icon-wrapper green-bg">
                <FiPackage size={32} color="white" />
              </div>
              <h3 className="card-title">Medical Inventory Optimizer</h3>
            </div>
            <p className="card-description">
              Reduce medical waste and optimize inventory with smart tracking, sharing networks, 
              and donation systems. Maximize resource utilization across healthcare facilities.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <FiPackage className="icon green" />
                <span>Smart expiry tracking & alerts</span>
              </div>
              <div className="feature-item">
                <FiUsers className="icon green" />
                <span>Generate clear reports</span>
              </div>
              <div className="feature-item">
                <FiClock className="icon green" />
                <span>Manage inventory efficiently</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
