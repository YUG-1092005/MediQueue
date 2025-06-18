import React from 'react';
import { FaBullseye, FaUsers, FaHeart } from 'react-icons/fa';
import './about.css';

export const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title">
            Transforming Healthcare Through Innovation
          </h2>
          <p className="about-subtitle">
            We believe healthcare should be efficient, sustainable, and patient-centered. 
            Our dual platform solution addresses two critical challenges that plague modern healthcare systems worldwide.
          </p>
        </div>

        <div className="about-cards">
          <div className="about-card">
            <div className="icon-circle blue-bg">
              <FaBullseye className="icon blue-icon" />
            </div>
            <h3 className="card-title">Our Vision</h3>
            <p className="card-text">
              Creating a world where healthcare is seamlessly efficient, with zero waiting anxiety 
              and minimal waste, powered by intelligent technology.
            </p>
          </div>
          <div className="about-card">
            <div className="icon-circle green-bg">
              <FaUsers className="icon green-icon" />
            </div>
            <h3 className="card-title">Target Users</h3>
            <p className="card-text">
              Hospitals, clinics, patients, healthcare administrators, and NGOs working together 
              to optimize healthcare delivery and resource utilization.
            </p>
          </div>
          <div className="about-card">
            <div className="icon-circle purple-bg">
              <FaHeart className="icon purple-icon" />
            </div>
            <h3 className="card-title">Impact</h3>
            <p className="card-text">
              Reducing patient stress, improving healthcare efficiency, minimizing medical waste, 
              and creating sustainable healthcare ecosystems for better outcomes.
            </p>
          </div>
        </div>

        <div className="problem-section">
          <h3 className="problem-title">The Problems We Solve</h3>
          <div className="problem-grid">
            <div className="problem-item">
              <h4 className="problem-subtitle blue-text">Queue Management Crisis</h4>
              <p className="problem-text">
                Patients spend hours in uncertainty, not knowing when they'll be seen. This creates stress, 
                overcrowding, and inefficient resource allocation in healthcare facilities.
              </p>
            </div>
            <div className="problem-item">
              <h4 className="problem-subtitle green-text">Medical Waste Emergency</h4>
              <p className="problem-text">
                Billions of dollars worth of medical supplies expire unused while other facilities 
                desperately need them. Poor inventory management leads to massive waste and shortages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
