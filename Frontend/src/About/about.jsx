import React, { useState, useEffect } from "react";
import {
  FaBullseye,
  FaEye,
  FaHeart,
  FaHospitalAlt,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaHandHoldingHeart,
  FaStar,
  FaLinkedin,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./about.css";
import axios from "axios";

const About = () => {
  const [form, setForm] = useState({ name: "", email: "", feedback: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await axios.post(`${import.meta.env.VITE_CONTACT_SERVER_URL}/api/contact/feedback`, form);
      setStatus("Thank you for your feedback!");
      setForm({ name: "", email: "", feedback: "" });
    } catch (err) {
      setStatus("Sorry, there was an error sending your feedback.");
    }
  };

  return (
    <section id="about" className="aboutpage-section">
      <div className="aboutpage-container">
        <div className="aboutpage-header">
          <h2 className="aboutpage-title">
            About <span className="aboutpage-highlight">MediQueue</span>
          </h2>
          <p className="aboutpage-description">
            Revolutionizing healthcare efficiency through smart queue systems
            and zero-waste inventory solutions—empowering clinics and hospitals.
          </p>
        </div>

        <div className="aboutpage-card">
          <div className="aboutpage-center">
            <FaBullseye className="aboutpage-icon blue" />
            <h3 className="aboutpage-subtitle">Our Mission</h3>
            <p className="aboutpage-text">
              We aim to revolutionize healthcare efficiency through smart queue
              systems and zero-waste inventory solutions—empowering clinics and
              hospitals to provide better care while reducing waste and
              improving patient experience.
            </p>
          </div>
        </div>

        <div className="aboutpage-vision">
          <div className="aboutpage-center">
            <FaEye className="aboutpage-icon white" />
            <h3 className="aboutpage-subtitle white-text">Our Vision</h3>
            <div className="aboutpage-grid">
              <div>
                <div className="aboutpage-bold white-text">
                  Universal Access
                </div>
                <p className="aboutpage-light">
                  Faster outpatient services for everyone, everywhere
                </p>
              </div>
              <div>
                <div className="aboutpage-bold white-text">Zero Waste</div>
                <p className="aboutpage-light">
                  Eliminate medical waste across India through smart inventory
                </p>
              </div>
              <div>
                <div className="aboutpage-bold white-text">Collaboration</div>
                <p className="aboutpage-light">
                  Streamlined NGO-clinic partnerships for better healthcare
                  coming soon..
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="aboutpage-help">
          <div className="aboutpage-center">
            <FaHeart className="aboutpage-icon red" />
            <h3 className="aboutpage-subtitle">Who We Help</h3>
            <p className="aboutpage-text">
              Our platform serves every stakeholder in the healthcare ecosystem
            </p>
          </div>

          <div className="aboutpage-grid">
            <div className="aboutpage-box">
              <div className="aboutpage-emoji">🧑‍⚕️</div>
              <h4 className="aboutpage-box-title">Patients</h4>
              <p>
                Reduced waiting times, clear communication, and stress-free
                healthcare visits
              </p>
              <div className="aboutpage-stat green">
                85% reduction in patient anxiety
              </div>
            </div>
            <div className="aboutpage-box">
              <div className="aboutpage-emoji">🏥</div>
              <h4 className="aboutpage-box-title">Clinics</h4>
              <p>
                Optimized operations, reduced waste, and improved patient
                satisfaction
              </p>
              <div className="aboutpage-stat blue">
                40% faster patient throughput
              </div>
            </div>
            <div className="aboutpage-box">
              <div className="aboutpage-emoji">🤝</div>
              <h4 className="aboutpage-box-title">NGOs</h4>
              <p>
                Better resource allocation, partnership opportunities, and
                community impact
              </p>
              <div className="aboutpage-stat purple">
                60% better resource utilization
              </div>
            </div>
          </div>
        </div>

        <div className="aboutpage-card-light">
          <div className="aboutpage-center">
            <FaHospitalAlt className="aboutpage-icon gray" />
            <h3 className="aboutpage-subtitle">Behind the Platform</h3>
            <p className="aboutpage-text">
              Created by passionate student and healthcare technology
              enthusiasts who witnessed firsthand the challenges in healthcare
              delivery. Our team combines technical expertise with deep
              understanding of healthcare workflows to create solutions that
              truly make a difference.
            </p>
            <div className="aboutpage-badges">
              <div
                className="linkedin-id"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#f3f6fb",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontWeight: 500,
                  fontSize: "15px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  marginBottom: "8px",
                }}
              >
                <FaLinkedin className="blue" style={{ fontSize: "20px" }} />
                <a
                  href="https://linkedin.com/in/yug-trivedi-7252102b0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#0077b5",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Yug Trivedi's LinkedIn
                </a>
              </div>
              <span>
                <FaStar className="yellow" /> Student Innovation
              </span>
              <span>
                <FaHeart className="red" /> Healthcare Focus
              </span>
              <span>
                <FaBullseye className="blue" /> Impact Driven
              </span>
            </div>
          </div>
        </div>

        <div className="aboutpage-roadmap">
          <div className="aboutpage-center">
            <FaCalendarAlt className="aboutpage-icon blue" />
            <h3 className="aboutpage-subtitle">Future Roadmap</h3>
            <p className="aboutpage-text">
              Our vision extends beyond current capabilities to transform
              healthcare delivery
            </p>
          </div>
          <div className="aboutpage-grid roadmap">
            <div className="roadmap-box blue-border">
              <div className="roadmap-quarter blue">Q1 2025</div>
              <h4>District Hospitals</h4>
              <p>
                Expand to government and district-level healthcare facilities
              </p>
            </div>
            <div className="roadmap-box orange-border">
              <div className="roadmap-quarter orange">Q2 2025</div>
              <h4>NGO Integration</h4>
              <p>
                Seamless integration with NGO partners for better resource
                sharing
              </p>
            </div>
            <div className="roadmap-box purple-border">
              <div className="roadmap-quarter purple">Q3 2025</div>
              <h4>AI Analytics</h4>
              <p>Predictive analytics for better resource planning</p>
            </div>
            <div className="roadmap-box orange-border">
              <div className="roadmap-quarter orange">Q4 2025</div>
              <h4>Mobile App</h4>
              <p>Native mobile applications for all stakeholders</p>
            </div>
          </div>
        </div>

        <div className="aboutpage-cta">
          <h3 className="aboutpage-cta-title">Join Our Mission</h3>
          <p className="aboutpage-cta-text">
            Be part of the healthcare revolution. Whether you're a clinic or
            healthcare professional, let's work together to create a more
            efficient and compassionate healthcare system.
          </p>
          <div className="aboutpage-cta-buttons">
            <Link to="/signup" className="aboutpage-cta-button white">
              Register Your Clinic <FaArrowRight />
            </Link>
          </div>
          <div className="aboutpage-contact">
            <div>
              <FaPhone /> +91 9313877075
            </div>
            <div>
              <FaEnvelope /> mediqueue24@gmail.com
            </div>
          </div>
        </div>

        <div id="contact" className="aboutpage-feedback">
          <h3 className="aboutpage-subtitle">Send Us Feedback</h3>
          <form className="aboutpage-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              rows="4"
              name="feedback"
              placeholder="Your Feedback"
              value={form.feedback}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Submit</button>
            {status && (
              <div style={{ marginTop: 10, color: "#007bff" }}>{status}</div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default About;
