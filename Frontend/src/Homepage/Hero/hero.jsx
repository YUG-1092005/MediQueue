import React, { useRef, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import "./hero.css";
import { Link } from "react-router-dom";

export const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  const handleShowVideo = () => {
    setShowVideo(true);
    // Scroll to video
    setTimeout(() => {
      videoRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart Health.
            <span className="gradient-text">Zero Waste.</span>
          </h1>
          <p className="hero-subtitle">
            Revolutionizing healthcare with intelligent queue management and
            medical inventory optimization. Reduce waiting times and eliminate
            waste with our cutting-edge dual platform solution.
          </p>

          <div className="hero-buttons">
            <a className="btn-primary">Explore Solutions</a>
            <button className="btn-secondary" onClick={handleShowVideo}>
              <Link to={"https://drive.google.com/file/d/1MIjs1Bux9Zx8A5MYemCf5H94kVxy2GlB/view?usp=sharing"} style={{textDecoration:"none", color:"#1260CC"}}>
              View Overview 
              </Link>
            </button>
          </div>
        </div>

        <div className="hero-icon">
          <FaArrowDown className="bounce" />
        </div>
      </div>
    </section>
  );
};
